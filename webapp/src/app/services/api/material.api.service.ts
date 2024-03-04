import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MaterialForm, MaterialJson } from 'src/app/models/material.model';
import { MaterialFolderForm, MaterialFolderJson } from 'src/app/models/material-folder.model';
import { patchFilesWithUrl } from 'src/app/state/file-uploaded/file-uploaded.state';
import { SharedApiService } from './shared.api.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialApiService {

  constructor(private http: HttpClient, private sharedApiService: SharedApiService) { }

  getMaterials(courseId: number): Observable<MaterialJson[]> {
    const url = `courses/${courseId}/materials`;
    const downloadUriBase = url;

    return this.http.get<MaterialJson[]>(url).pipe(
      take(1),
      map(items => items.map(item => ({
        ...item,
        files: patchFilesWithUrl(item?.files, `${downloadUriBase}/${item.id}/files`)
      })))
    );
  }

  getFolderMaterials(courseId: number, folderId: number): Observable<MaterialJson[]> {
    const url = `courses/${courseId}/materials/folders/${folderId}/materials`;
    const downloadUriBase = `courses/${courseId}/materials`;

    return this.http.get<MaterialJson[]>(url).pipe(
      take(1),
      map(items => items.map(item => ({
        ...item,
        files: patchFilesWithUrl(item?.files, `${downloadUriBase}/${item.id}/files`)
      })))
    );
  }

  getFolders(courseId: number): Observable<MaterialFolderJson[]> {
    const url = `courses/${courseId}/materials/folders`;

    return this.http.get<MaterialFolderJson[]>(url).pipe(
      take(1)
    );
  }

  changeMaterialFolder({ courseId, materialId, folderId }: { courseId: number; materialId: number; folderId: number }): Observable<void> {
    if(folderId == -1) { // mover para a pasta raiz
      const url = `courses/${courseId}/materials/${materialId}/folder`;

      return this.http.delete<void>(url).pipe(take(1));
    }
    // mover para dentro de uma pasta
    const url = `courses/${courseId}/materials/${materialId}/folder/${folderId}`;

    return this.http.post<void>(url, null).pipe(take(1));
  }

  editMaterialLink({ courseId, materialId, body }: { courseId: number; materialId: number; body: MaterialForm; }): Observable<MaterialJson> {
    const url = `courses/${courseId}/materials/${materialId}`;

    return this.http.put<MaterialJson>(url, body).pipe(take(1));
  }

  deleteMaterial({ courseId, materialId }: { courseId: number; materialId: number; }): Observable<void> {
    const url = `courses/${courseId}/materials/${materialId}`;

    return this.http.delete<void>(url).pipe(take(1));
  }

  create({ body, courseId }: { body: MaterialForm; courseId: number; }): Observable<MaterialJson> {
    const url = `courses/${courseId}/materials`;

    return this.http.post<MaterialJson>(url, body).pipe(take(1));
  }

  createFiles({ files, courseId }: { files: File[]; courseId: number; }): Observable<MaterialJson[]> {
    const url = `courses/${courseId}/materials/files`;

    return (this.sharedApiService.uploadFiles(files, url) as Observable<MaterialJson[]>).pipe(take(1), map(items => items.map(item => ({
      ...item,
      files: patchFilesWithUrl(item?.files, `courses/${courseId}/materials/${item.id}/files`)
    }))));
  }

  createFolder({ body, courseId }: { body: MaterialFolderForm; courseId: number; }): Observable<MaterialFolderJson> {
    const url = `courses/${courseId}/materials/folders`;

    return this.http.post<MaterialFolderJson>(url, body).pipe(take(1));
  }

  editFolder({ courseId, folderId, body }: { courseId: number; folderId: number; body: MaterialFolderForm; }): Observable<MaterialFolderJson> {
    const url = `courses/${courseId}/materials/folders/${folderId}`;
    
    return this.http.put<MaterialFolderJson>(url, body).pipe(take(1));
  }

  deleteFolder({ folderId, courseId }: { folderId: number; courseId: number; }): Observable<void> {
    const url = `courses/${courseId}/materials/folders/${folderId}`;

    return this.http.delete<void>(url).pipe(take(1));
  }
}
