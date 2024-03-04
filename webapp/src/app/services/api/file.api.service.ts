import { HttpBackend, HttpClient, HttpEvent, HttpEventType, HttpHeaderResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForage } from 'ngforage';
import { defer, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { FileState, FileStatus, FileUploadedJson } from 'src/app/models/file-uploaded.model';
import { patchFilesWithUrl, trimFileId } from 'src/app/state/file-uploaded/file-uploaded.state';

@Injectable({
  providedIn: 'root'
})
export class FileApiService {

  anotherHttp: HttpClient;
  fileStore: NgForage;

  constructor(handler: HttpBackend, private readonly ngf: NgForage, private http: HttpClient) {
    this.fileStore = ngf.clone({ name: 'offline-files', });
    this.anotherHttp = new HttpClient(handler);

  }

  listFiles(url: string): Observable<FileUploadedJson[]> {
    return this.http.get<FileUploadedJson[]>(url).pipe(
      take(1),
      map(files => patchFilesWithUrl(files, url))
    );
  }

  uploadFile({ url, blob, fileName }: { url: string; blob: Blob; fileName: string }): Observable<{ response: HttpEvent<FileUploadedJson[]>, status: FileStatus, result?: FileUploadedJson[] }> {

    const formData: FormData = new FormData();
    formData.append('files', blob, fileName);

    return this.http.post<FileUploadedJson[]>(url, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'json'
    }).pipe(
      map(response => {
        const lastModified = new Date().getTime().toString();

        if (response instanceof HttpHeaderResponse && response.status === 200) {
          return {
            response,
            status: {
              progress: 1,
              lastModified: lastModified,
              currently: FileState.Uploaded,
            },

          };
        } else if (response instanceof HttpResponse && response.status === 200) {
          return {
            response,
            status: {
              progress: 1,
              lastModified: lastModified,
              currently: FileState.Uploaded,
            },
            result: (response.body.map(item => ({
              ...item,
              downloadUri: `${url}/${encodeURIComponent(item.fileName)}`,
            })) ?? []) as FileUploadedJson[]
          };
        } else if (response.type === HttpEventType.UploadProgress) {
          return {
            response,
            status: {
              progress: response.total ? response.loaded / response.total : 0.5,
              lastModified: lastModified,
              currently: FileState.IsUploading,
            }
          };
        } else {
          if (!!response?.type) {
            console.warn({ response, type: response?.type });
          }
          return {
            response,
            status: null
          }
        }
      }),
      filter(data => !!data?.status)
    );
  }

  deleteFile(url: string) {
    return this.http.delete<void>(url);
  }

  downloadFile({ url, id }: { url: string; id: string; }): Observable<{ id: string, response: HttpEvent<Blob>, status: FileStatus }> {

    return this.anotherHttp.request('GET', url, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }).pipe(
      map((response: HttpEvent<Blob>) => {
        const lastModified = new Date().getTime().toString();
        // console.log(response)

        if (response instanceof HttpHeaderResponse && response.status === 200) {
          return {
            id, response,
            status: {
              progress: 0,
              lastModified: lastModified,
              currently: FileState.IsDownloading,
            }
          };
        } else if (response instanceof HttpResponse && response.status === 200) {
          return {
            id, response,
            status: {
              progress: 1,
              lastModified: lastModified,
              currently: FileState.IsDownloading,
            }
          };
        } else if (response.type === HttpEventType.DownloadProgress) {
          return {
            id: id, response,
            status: {
              progress: response.total ? response.loaded / response.total : 0.5,
              lastModified: lastModified,
              currently: FileState.IsDownloading,
            }
          };
        } else {
          if (!!response?.type) {
            console.warn({ response, type: response?.type });
          }

          return {
            id, response,
            status: null
          }
        }
      })
    );
  }

  getFile<T = any>(key: string): Observable<T> {
    return defer(() => this.fileStore.getItem<T>(trimFileId(key)));
  }

  setFile<T = any>(key: string, data: T): Observable<T> {
    return defer(() => this.fileStore.setItem<T>(trimFileId(key), data));
  }

  removeFile(key: string): Observable<void> {
    return defer(() => this.fileStore.removeItem(trimFileId(key)));
  }

  listKeys(): Observable<string[]> {
    return defer(() => this.fileStore.keys());
  }

  clear(): Observable<void> {
    return defer(() => this.fileStore.clear());
  }
}
