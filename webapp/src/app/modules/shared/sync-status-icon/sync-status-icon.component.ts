import { Component, Input } from '@angular/core';
import { FileState } from 'src/app/models/file-uploaded.model';

@Component({
  selector: 'app-sync-status-icon',
  templateUrl: './sync-status-icon.component.html',
  styleUrls: ['./sync-status-icon.component.css']
})
export class SyncStatusIconComponent {
  @Input() syncStatus: FileState = FileState.IsDownloading;

  constructor() { }

  transformString(str: string): string {
    // Example: Transforms "NeedsToBeDownloaded" in "Needs to be downloaded"
    const transformed = str.replace(/(?<!^)([A-Z][a-z]*)/g, ' $1').toLowerCase();
    return transformed.charAt(0).toUpperCase() + transformed.slice(1);
  }
}
