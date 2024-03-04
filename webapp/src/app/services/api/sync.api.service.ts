import { Injectable } from '@angular/core';
import { NgForage } from 'ngforage';
import { defer, from, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SyncApiService {

  constructor(private readonly ngf: NgForage) { }

  getItem<T = any>(key: string): Observable<T> {
    return from(this.ngf.getItem<T>(key)).pipe(take(1));
  }

  setItem<T = any>(key: string, data: T): Observable<T> {
    return from(this.ngf.setItem<T>(key, data)).pipe(take(1));
  }

  listKeys(): Observable<string[]> {
    return from(this.ngf.keys()).pipe(take(1));
  }

  clear(): Observable<void> {
    return defer(() => this.ngf.clear())
  }
}
