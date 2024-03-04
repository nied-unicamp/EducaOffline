import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { filter, first, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UpdateAppService {

  constructor(private appRef: ApplicationRef, private updates: SwUpdate) {
    updates.unrecoverable.subscribe(event => {
      alert(
        `An error occurred that we cannot recover from:\n${event.reason}\n\n` +
        'Please reload the page.');
    });
  }

  checkUpdates() {
    console.log("CheckUpdate initialization...");

    // Allow the app to stabilize first, before starting polling for updates with `interval()` (in ms).
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const oncePerMinute$ = interval(1 * 60 * 1000)

    const checkUpdates$ = concat(appIsStable$, oncePerMinute$);

    checkUpdates$.subscribe(() => {
      console.log("Checking for updates");
      this.updates.checkForUpdate();
    });

    this.updates.versionUpdates.pipe(
      filter(event => event.type === 'VERSION_READY'),
      take(1)
    ).subscribe(event => {
      if (this.promptUser(event)) {
        this.updates.activateUpdate().then(() => document.location.reload());
      }
    });
  }

  // TODO: Make it into the notification system
  private promptUser(event: any): boolean {
    console.log({ event });
    return confirm("New app version is available. Please reload the page to upgrade");
  }

  showLogs() {
    this.updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
    });
    this.updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }

}
