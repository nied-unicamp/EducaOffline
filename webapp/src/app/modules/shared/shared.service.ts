import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import deepEqual from 'deep-equal';
import { Observable, of, zip } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { LANGUAGE } from 'src/app/dev/languages';
import { fromArray2 } from 'src/app/models';
import { fromJsonToUploadedFile, UploadedFile, UploadedFileJson } from 'src/app/models/file';
import { PermissionSM } from 'src/app/models/permission.model';
import { RoleSM } from 'src/app/models/role.model';
import { RoleSelectors } from 'src/app/state/role/role.selector';
import { AppService } from './../../services/app.service';
import { SharedApiService } from 'src/app/services/api/shared.api.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  static translationText = LANGUAGE.shared;

  permissions: PermissionSM[] = [];

  constructor(
    private http: HttpClient,
    private appService: AppService,
    private store: Store,
    private sharedApiService: SharedApiService
  ) {
    this.store.select(RoleSelectors.current).pipe(
      distinctUntilChanged<RoleSM>(deepEqual),
      map((role) => role?.permissions ?? [])
    ).subscribe({ next: permissions => this.permissions = permissions })
  }

  hasPermission(permission: string): boolean {
    return this.permissions?.some(p => p.name === permission);
  }

  /* ----------------------------- Date Methods ----------------------------- */

  /**
   * @returns - (HH:mm)
   */
  timeString(date: Date) {
    return this.to2digits(date.getHours()) + ':' + this.to2digits(date.getMinutes());
  }

  /**
   * Parse a Date to the HMTL date string format (yyyy-MM-dd)
   *
   * @param date - Date to be parsed
   * @returns - (yyyy-MM-dd)
   */
  dateString(myDate: Date, year = true): string {
    const date = new Date(myDate);

    if (!date) {
      return null;
    }

    return '' + date.getFullYear() + '-' +
      this.to2digits(date.getMonth() + 1) +
      (year ? '-' + this.to2digits(date.getDate()) : '');
  }

  readableDate(date: Date): string {
    const now = new Date();

    if (date > now) {
      return '*Será publicado em ' + date.toLocaleDateString();
    }

    if (date.getFullYear() === now.getFullYear()) {
      if (date.getMonth() === now.getMonth()) {
        if (date.getDate() === now.getDate()) {
          if (date.getHours() === now.getHours()) {
            if (date.getMinutes() === now.getMinutes()) {
              return 'Agora';
            } else if (date.getMinutes() + 1 === now.getMinutes()) {
              return '1 minuto atrás';
            } else {
              return (now.getMinutes() - date.getMinutes()) + ' minutos atrás';
            }
          } else if (now.getHours() - 1 === date.getHours()) {
            return (60 - date.getMinutes() + now.getMinutes()) + ' minutos atrás';
          } else {
            return (now.getHours() - date.getHours()) + ' horas atrás';
          }
        } else if (date.getDate() + 1 === now.getDate()) {
          return 'Ontem';
        } else {
          return (now.getDate() - date.getDate()) + ' dias atrás';
        }
      } else {
        const monthDiff = now.getMonth() - date.getMonth();

        if (monthDiff === 1) {
          return 'Mês passado';
        }
        return monthDiff + ' meses atrás';
      }
    } else {
      const yearDiff = now.getFullYear() - date.getFullYear();

      if (yearDiff === 1) {
        return 'Ano passado';
      }
      return yearDiff + ' anos atrás';
    }
  }

  to2digits(n: number): string {
    if (n < 10) {
      return '0' + n;
    }
    return n.toString();
  }

  convertFromNgb(date: NgbDate, isEndOfDay: boolean): Date {
    if (isEndOfDay) {
      return new Date(date.year, date.month - 1, date.day, 23, 59, 59);
    }

    return new Date(date.year, date.month - 1, date.day);
  }

  convertToNgb(date: Date): NgbDate {
    if (date instanceof Date) {
      return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    return null;
  }


  /* ----------------------------- File methods ----------------------------- */

  public uploadFiles(files: File[], url: string): Observable<any> {
    return this.sharedApiService.uploadFiles(files, url);
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
      const names = toDelete.map(file => (encodeURIComponent(file.fileName)));
      observables.push(this.deleteFiles(url + '/', names));
    }

    if (upload && upload.length > 0) {
      observables.push(this.uploadFiles(upload, url));
    }

    if (observables.length === 0) {
      return of(null);
    }

    return zip(...observables);
  }

  getFileList(folderID: number): Observable<UploadedFile[]> {
    const url = `/folder/${folderID}`;

    return this.http.get<{ files: UploadedFileJson[] }>(url).pipe(
      map(json => json.files),
      map(fromArray2(fromJsonToUploadedFile))
    );
  }


  public downloadLink(path: string): string {
    return this.appService.baseUrl + path + '?access_token=' + this.appService.token;
  }

  /**
   * Transform a number of bytes to an human readable format.
   * Example: Transforms '333627392' into '318.2 MB'
   *
   * @param bytes - File size in bytes
   * @returns - Human readable size string
   */
  byteSizeString(bytes: number): string {
    if (Math.abs(bytes) < 1024) {
      return bytes + ' B';
    }
    const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    do {
      bytes /= 1024;
      ++u;
    } while (Math.abs(bytes) >= 1024 && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
  }


  getFileIconClass(mimeType: string): IconProp {

    switch (mimeType?.split('/')?.[0]) {
      case 'audio':
        return 'file-audio';
      case 'video':
        return 'file-video';
      case 'image':
        return 'file-image';
      case 'text':
        return 'file-alt';
      default:
        switch (mimeType) {
          case 'application/pdf':
            return 'file-pdf';

          case 'application/msword':
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'file-excel';

          case 'application/vnd.ms-excel':
          case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return 'file-excel';

          case 'application/vnd.ms-powerpoint':
          case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return 'file-powerpoint';

          case 'application/zip':
          case 'application/x-7z-compressed':
          case 'application/x-rar-compressed':
            return 'file-archive';

          default:
            return 'file';
        }
    }
  }
}
