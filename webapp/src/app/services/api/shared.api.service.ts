import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, zip } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { UploadedFile } from 'src/app/models/file';
import { ImageCompressorService, CompressorConfig } from 'ngx-image-compressor';
import { ConnectionSpeedTestService } from './connection-speed-test.service';

@Injectable({
  providedIn: 'root'
})
export class SharedApiService {

  constructor(private http: HttpClient, private imageCompressor: ImageCompressorService, private connectionSpeedTestService: ConnectionSpeedTestService) { }


  public getUrlTitle(link: string): Observable<string> {
    const url = 'https://textance.herokuapp.com/rest/title/' + link;

    return this.http.get(url, { responseType: 'text' }).pipe(
      map((data: string) => {
        console.log('O título da página é: ' + data);

        return data;
      }),
      catchError((err: HttpErrorResponse) => {
        console.log('Não foi possível encontrar o título da página: ' + link);
        return of(null);
      }),
    );
  }


  /* ----------------------------- File methods ----------------------------- */

  public uploadFiles(files: File[], url: string): Observable<any> {
    // If there is no file to upload, just return
    if (!files || files.length === 0) {
      return of(null);
    }
  
    return this.connectionSpeedTestService.uploadSpeedTest().pipe(
      switchMap(uploadSpeed$ => {
        let config: CompressorConfig;
  
        if (uploadSpeed$ == -1) config = undefined;
        else if (uploadSpeed$ > 80) config = { orientation: 1, ratio: 100, quality: 100, enableLogs: true };
        else if (uploadSpeed$ > 40) config = { orientation: 1, ratio: 75, quality: 75, enableLogs: true };
        else config = { orientation: 1, ratio: 50, quality: 50, enableLogs: true };
  
        // Use Promise.all to wait for all promises to resolve
        const compressedFilesPromises = files.map(async (file: File) => {
          if (config == undefined) return file;
          if (file.type.startsWith('image/')) {
            // Compress only if it's an image
            const compressedFile: File = await this.imageCompressor.compressFile(file, config);
            return compressedFile;
          } else {
            // Return the original file for non-image files
            return file;
          }
        });
  
        return forkJoin(compressedFilesPromises).pipe(
          mergeMap((compressedFiles: File[]) => {
            console.log(compressedFiles);
            const formData: FormData = new FormData();
  
            compressedFiles.forEach((item, index) => {
              formData.append('files', item, item?.name || `file${index}`);
            });
  
            return this.http.post(url, formData).pipe(
              catchError(error => {
                console.error('Error uploading files:', error);
                return of(null);
              })
            );
          })
        );
      })
    );
  }


  /**
   * Send a delete request to the API
   *
   * @param delString - path to delete something
   */
  deleteFile(delString: string) {
    return this.http.delete(delString);
  }

  /**
   * Delete a list of files inside the same "directory"
   *
   * @param baseString - path ending with /
   */
  deleteFiles(baseString: string, names: string[]): Observable<void> {

    return zip(...names.map(name => this.http.delete(baseString + name))).pipe(
      map(_ => { })
    );
  }

  uploadFileChanges(url: string, toDelete: UploadedFile[], upload: File[]): Observable<any> {
    const observables: Observable<any>[] = [];

    if (toDelete && toDelete.length > 0) {
      const names = toDelete.map(file => encodeURIComponent(file.fileName));
      observables.push(this.deleteFiles(url, names));
    }

    if (upload && upload.length > 0) {
      observables.push(this.uploadFiles(upload, url));
    }

    if (observables.length === 0) {
      return of(null);
    }

    return zip(...observables);
  }
}
