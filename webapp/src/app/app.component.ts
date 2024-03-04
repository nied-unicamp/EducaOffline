import { Component } from '@angular/core';
import LogRocket from 'logrocket';
import { environment } from 'src/environments/environment';
import { FileApiService } from './services/api/file.api.service';
import { UpdateAppService } from './services/service-worker/update-app.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: 'app.component.html'

})
export class AppComponent {

  constructor(update: UpdateAppService, private fileApi: FileApiService) {

    if (environment.offline) {
      update.checkUpdates();
      update.showLogs();
    }

    //if (!environment?.disableLogRocket && environment.production && !environment.offline) {
    //  LogRocket.init('pmvrxg/proteo-prod');
    //}
  }
}
