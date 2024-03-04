import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConnectionSpeedTestService {
  constructor(private http: HttpClient) {}

  public downloadSpeedTest(): Observable<number> {
    const url = 'test/download';

    return this.measureDownloadSpeed(url);
  }

  public uploadSpeedTest(): Observable<number> {
    const url = 'test/upload';

    // Generate a small random file
    const fileSizeInBytes = 1 * 1024; // 1 KB
    const fileContent = new Uint8Array(fileSizeInBytes);
    crypto.getRandomValues(fileContent);
    const testFile = new File([fileContent], 'test-file');

    return this.measureUploadSpeed(testFile, url);
  }

  private measureDownloadSpeed(url: string): Observable<number> {
    const startTime = performance.now();

    return this.http.get(url, { responseType: 'blob' }).pipe(
      switchMap(response => {
        const endTime = performance.now();
        const elapsedTime = (endTime - startTime) / 1000; // convert to seconds
        const downloadSpeed = (response.size / elapsedTime) / 1024; // in KB/s
        return of(downloadSpeed);
      }),
      catchError(error => {
        console.error('Error downloading test file:', error);
        return of(-1);
      })
    );
  }

  private measureUploadSpeed(file: File, url: string): Observable<number> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const startTime = performance.now();
    
    return this.http.post(url, formData).pipe(
      switchMap(() => {
        const endTime = performance.now();
        const elapsedTime = (endTime - startTime) / 1000; // convert to seconds
        const uploadSpeed = (file.size / elapsedTime) / 1024; // in KB/s
        return of(uploadSpeed);
      }),
      catchError(error => {
        console.error('Error uploading test file:', error);
        return of(-1);
      })
    );
  }
}
