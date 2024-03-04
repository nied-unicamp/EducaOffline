import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { FileState, FileUploaded } from 'src/app/models/file-uploaded.model';
import { Material } from 'src/app/models/material.model';
import { FileApiService } from 'src/app/services/api/file.api.service';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { getFileId } from 'src/app/state/file-uploaded/file-uploaded.state';
import { LoginAdvancedSelectors } from 'src/app/state/login/login.advanced.selector';
import { MaterialActions } from 'src/app/state/material/material.actions';
import { SharedService } from './../../shared/shared.service';
import { MaterialFolder } from 'src/app/models/material-folder.model';
import { MaterialService } from '../material.service';
import { MaterialOfflineSelectors } from 'src/app/state/material/offline/material.offline.selector';
import { Observable } from 'rxjs';
import { LoginSelectors } from 'src/app/state/login/login.selector';


@Component({
  selector: 'app-material-item',
  templateUrl: './material-item.component.html',
  styleUrls: ['./material-item.component.css']
})
export class MaterialItemComponent implements OnInit, OnChanges {

  @Input() material: Material;
  @Input() canDelete: boolean;
  @Input() folders: MaterialFolder[];

  hasFiles: boolean = false;
  fileClass: IconProp = 'file';
  url: string;
  courseId: number;
  baseUrl: string;
  token: string;

  filename: string;

  dateReadable: string;
  dateFull: string = '';
  sizeStr: string;

  iconTitle = MaterialService.translationText.general.file;

  syncState$: Observable<FileState>;
  wasDeleted$: Observable<boolean>;

  downloadOptions: {title: string; icon: IconProp; cb: () => void;}[] = [];

  constructor(private sharedService: SharedService, private store: Store, private fileApi: FileApiService) {
    this.ngOnChanges()
    this.store.select(CourseSelectors.currentId).subscribe((data: number) => {
      this.courseId = Number(data);
    });

    this.store.select(LoginSelectors.state).pipe(
      take(1),
    ).subscribe(loginState => {
      this.baseUrl = loginState.apiUrl;
      this.token = loginState?.token?.value;
    });

  }

  ngOnInit() {
    this.dateFull = this.material?.lastModifiedDate.toLocaleString('pt-BR');
    this.dateReadable = this.dateFull;
    this.syncState$ = this.store.select(MaterialOfflineSelectors.materialSyncState(this.material.id));
    this.wasDeleted$ = this.syncState$.pipe(map(state => state == 'NeedsToBeDeleted'));

    this.hasFiles = !!this.getFile()

    if(this.hasFiles) {
      const pattern = /([^_]+)_(\d+p)_(\d+)\.([^\.]+)$/;

      // Test if the string matches the pattern
      const match = this.material.files[0].fileName.match(pattern);

      if(match) {
        this.sizeStr = "";
        this.filename = `${match[1]}.${match[4]}`; // concatena nome com extensão -> nome do arquivo original

        // Cria opcoes de download
        for(let f of this.material.files) {
          this.downloadOptions.push({
            icon: 'download', 
            title: `Download ${f.fileName.match(pattern)[2]} (${this.sharedService.byteSizeString(f.byteSize)})`,
            cb: () => this.downloadFileByUri(f.downloadUri)
          })
        }

        console.log("opcoes: " + this.downloadOptions);
      }
      else {
        this.sizeStr = this.sharedService.byteSizeString(this.getFile().byteSize);
        this.filename = this.material.files[0]?.fileName;
      }

      this.fileClass = this.sharedService.getFileIconClass(this.getFile().mimeType); // coloca icone de acordo com o tipo do arquivo [0]
    }
  }


  ngOnChanges() {
    if (this.material?.link) {
      this.url = this.material.link;
    } else {

      this.store.select(
        LoginAdvancedSelectors.fileDownloadLink,
        { path: this.material?.files[0]?.downloadUri }
      ).pipe(take(1)).subscribe(url => this.url = url)
    }
  }

  private getFile(): FileUploaded {

    if (this.material === null) {
      return null;
    }

    const file = this.material?.files[0];

    if (!file) {
      return null;
    }

    return file;
  }

  openLocalFile(event: Event) {
    let fileId = getFileId(this.material.files[0]);

    // verifica se o arquivo ja está baixado localmente, se estiver, não abre o link (preventDefault).
    if ([
      FileState.Downloaded,
      FileState.NeedsToBeUploaded,
      FileState.IsUploading
    ].includes(this.getFile().status.currently)) {
      event.preventDefault();
    } else {
      return; // não está presente localmente -> Deixa abrir o link
    }

    // se estiver presente pega o arquivo local e baixa para a máquina do usuário
    this.fileApi.getFile<Blob>(fileId).subscribe(
      file => {
        console.log({ fileId, file })
        const url = URL.createObjectURL(file)
        var a = document.createElement("a");
        a.href = url;
        // a.target = 'texto';
        // Don't set download attribute
        a.download = this.material.files[0].fileName;
        a.click();

        // window.open(url, '_blank');

        setTimeout(() => {
          URL.revokeObjectURL(url)
        }, 500);
      }
    )
  }

  delete() {
    this.store.dispatch(MaterialActions.delete.request({
      input: {
        courseId: this.courseId,
        materialId: this.material.id
      }
    }));
  }

  getDateAndSize(): string {
    let str = this.dateFull.split(',')[0];
    if(this.sizeStr) str += ` (${this.sizeStr})`;
    return str;
  }

  downloadFileByUri(downloadUri: string) {
    const link = document.createElement('a');

    const fullUrl = this.baseUrl + downloadUri + `?access_token=${this.token}`;

    link.setAttribute('href', fullUrl);
    link.setAttribute('target', '_blank');
    link.style.display = 'none';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  }
}
