import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivityShareComponent } from './activity-share/activity-share.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { DateTimeComponent } from './date-time/date-time.component';
import { DisplayDateComponent } from './display-date/display-date.component';
import { FileEditUploadComponent } from './file-edit-upload/file-edit-upload.component';
import { FileItemComponent } from './file-item/file-item.component';
import { FileListComponent } from './file-list/file-list.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { IconDisponivelOfflineComponent } from './icons/icon-disponivel-offline/icon-disponivel-offline.component';
import { IconDownloadDisponivelComponent } from './icons/icon-download-disponivel/icon-download-disponivel.component';
import { IconErroSincronizacaoComponent } from './icons/icon-erro-sincronizacao/icon-erro-sincronizacao.component';
import { IconSincronizacaoAndamentoComponent } from './icons/icon-sincronizacao-andamento/icon-sincronizacao-andamento.component';
import { IconSincronizacaoNecessariaComponent } from './icons/icon-sincronizacao-necessaria/icon-sincronizacao-necessaria.component';
import { ModalFormComponent } from './modal-form/modal-form.component';
import { PublicationDateComponent } from './publication-date/publication-date.component';
import { SharedService } from './shared.service';
import { SyncStatusIconComponent } from './sync-status-icon/sync-status-icon.component';
import { BotaoTranslateComponent } from './botao-translate/botao-translate.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
    RouterModule
  ],
  declarations: [
    PublicationDateComponent,

    FileUploadComponent,
    FileEditUploadComponent,
    FileItemComponent,
    FileListComponent,

    ActivityShareComponent,
    DisplayDateComponent,
    ConfirmDeleteComponent,
    DateTimeComponent,
    ModalFormComponent,
    IconDownloadDisponivelComponent,
    IconDisponivelOfflineComponent,
    IconSincronizacaoNecessariaComponent,
    IconErroSincronizacaoComponent,
    IconSincronizacaoAndamentoComponent,
    SyncStatusIconComponent,
    BotaoTranslateComponent
  ],
  exports: [
    PublicationDateComponent,

    DateTimeComponent,

    FileUploadComponent,
    FileEditUploadComponent,
    FileListComponent,

    ActivityShareComponent,
    // Add the icons component to shared module
    IconDownloadDisponivelComponent,
    IconDisponivelOfflineComponent,
    IconSincronizacaoNecessariaComponent,
    IconErroSincronizacaoComponent,
    IconSincronizacaoAndamentoComponent,
    SyncStatusIconComponent,

    ConfirmDeleteComponent,
    DisplayDateComponent,
    ModalFormComponent,

    IconDownloadDisponivelComponent,
    IconDisponivelOfflineComponent,
    IconSincronizacaoNecessariaComponent,
    IconErroSincronizacaoComponent,
    IconSincronizacaoAndamentoComponent,
    BotaoTranslateComponent
  ],
  providers: [
    SharedService,
    DatePipe
  ]
})
export class SharedModule { }
