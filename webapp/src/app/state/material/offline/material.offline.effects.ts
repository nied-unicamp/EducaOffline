import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, filter, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { FileState, FileUploadedSM } from 'src/app/models/file-uploaded.model';
import { fromSMToMaterialForm, MaterialSM } from 'src/app/models/material.model';
import { FileApiService } from 'src/app/services/api/file.api.service';
import { MaterialSelectors } from 'src/app/state/material/material.selector';
import { FileUploadedActions } from '../../file-uploaded/file-uploaded.actions';
import { FileUploadedSelectors } from '../../file-uploaded/file-uploaded.selector';
import { getFileId } from '../../file-uploaded/file-uploaded.state';
import { LoginSelectors } from '../../login/login.selector';
import { OfflineRequestType } from '../../shared/offline/offline.state';
import { AppState } from '../../state';
import { MaterialActions } from '../material.actions';
import { MaterialOfflineActions } from './material.offline.actions';
import { MaterialOfflineSelectors } from './material.offline.selector';

@Injectable()
export class MaterialOfflineEffects {

  // tentou acessar os materiais enquanto estava offline,
  // salva para fazer fetchAll assim que voltar a internt.
  loadOffline = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.fetchAll.offlineError),
    map(({input}) => MaterialActions.offline.requested.groupIds.add.one({data: input.courseId}))
  ))

  createLinkOffline$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.create.link.offlineError),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    map(([{ input, info }, userId]) => {
      const materialSM = {
        id: info.id,
        title: input.body.title,
        files: [],
        link: input.body.link,
        folder: input.folderId,
        description: '',
        createdById: userId,
        createdDate: info.date,
        lastModifiedById: userId,
        lastModifiedDate: info.date
      } as MaterialSM

      return MaterialOfflineActions.meta.addOfflineLink({
        idAndGroup: {
          id: info.id,
          groupId: input.courseId
        },
        material: materialSM
      })
    }),
  ));

  editLinkOffline$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.editLink.offlineError),
    concatMap(({ input }) => this.store.select(MaterialSelectors.byId(input.materialId)).pipe(
      take(1), // needs to take only one because when the object is updated the observer sends another value
      map(material => {
        // updates the title and description, keeping the remaining information
        const editedMaterial = {
          ...material,
          title: input.body.title,
          description: input.body.description ?? ""
        }

        const idAndG = {
          id: input.materialId,
          groupId: input.courseId
        };

        return [
          MaterialOfflineActions.meta.updateOfflineMaterial({
            idAndGroup: idAndG,
            material: editedMaterial
          }),
          // Only marks to update later if the link is already present in server database
          (material.id < 1600000000000) ? MaterialOfflineActions.updated.add({ data: idAndG }) : null,
        ].filter(Boolean);
      }),
      concatMap(actions => of(...actions))
    )),
  ));

  moveMaterialOffline$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.changeMaterialFolder.offlineError),
    concatMap(({ input }) => this.store.select(MaterialSelectors.byId(input.materialId)).pipe(
      take(1), // needs to take only one because when the object is updated the observer sends another value
      map(material => {
        // updates the folder of the material, keeping the rest of the information
        const movedMaterial = {
          ...material,
          folder: input.folderId
        }

        const idAndG = {
          id: input.materialId,
          groupId: input.courseId
        };

        return [
          MaterialOfflineActions.meta.updateOfflineMaterial({
            idAndGroup: idAndG,
            material: movedMaterial
          }),
          // Only marks to update later if the link is already present in server database
          (material.id < 1600000000000) ? MaterialOfflineActions.updated.add({ data: idAndG }) : null,
        ].filter(Boolean);
      }),
      concatMap(actions => of(...actions))
    )),
  ));

  deleteFileCreatedOffline$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.offline.sync.created.byId),
    concatMap(({ input }) => this.store.select(MaterialSelectors.byId(input.id)).pipe(
      map(material => ({
        courseId: input.groupId,
        materialId: input.id,
        fileId: material?.files?.[0]
      })),
    )),
    filter(({ fileId }) => !!fileId),
    concatMap(input => this.store.select(FileUploadedSelectors.byId(input.fileId)).pipe(
      map(file => ({
        ...input, file
      }))
    )),
    concatMap(({ file, courseId }) => this.actions$.pipe(
      ofType(MaterialActions.create.files.success),
      filter(({ input }) => input.courseId == courseId && input.files?.[0].size === file.byteSize),
      map(_ => FileUploadedActions.local.database.remove.request({ input: { id: getFileId(file), deleteAll: true } }))
    )),
  ))

  deleteOffline$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.delete.offlineError),
    map(({ input }) => MaterialActions.offline.deleted.add({
      data: {
        groupId: input.courseId,
        id: input.materialId
      }
    }))
  ));

  // Material
  uploadOffline$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.create.files.offlineError),
    withLatestFrom(this.store.select(LoginSelectors.loggedUserId)),
    concatMap(([{ input, info }, userId]) => of(...input.files.map((file, index) => ({ file, index }))).pipe(
      map(({ file, index }) => {
        const materialId = (<number>info.id) + index;
        const fileHex = 'local_upload_' + materialId.toString();
        const date: string = info.date

        const fileUploadedSM = {
          byteSize: file.size,
          mimeType: file.type,
          fileName: file.name,
          status: {
            currently: FileState.NeedsToBeUploaded,
            lastModified: info.date.toString(),
            progress: 0
          },
          downloadUri: `courses/${input.courseId}/materials/${materialId}/files/${encodeURIComponent(file.name)}`,
          sha3Hex: fileHex
        } as FileUploadedSM

        const materialSM = {
          id: materialId,
          title: file.name,
          files: [getFileId(fileUploadedSM)],
          description: '',
          folder: input.folderId,
          createdById: userId,
          createdDate: date,
          lastModifiedById: userId,
          lastModifiedDate: date
        } as MaterialSM

        return MaterialOfflineActions.meta.addOfflineMaterial({
          file,
          fileSM: fileUploadedSM,
          idAndGroup: {
            id: materialId,
            groupId: input.courseId
          },
          material: materialSM
        })
      }),
    )),
  ));


  markMaterialAsCreatedOffline$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.offline.meta.addOfflineMaterial),
    map(({ idAndGroup }) => MaterialOfflineActions.created.add.one({ data: idAndGroup }))
  ));

  markMaterialLinkAsCreatedOffline$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.offline.meta.addOfflineLink),
    map(({ idAndGroup }) => MaterialOfflineActions.created.add.one({ data: idAndGroup }))
  ));



  // ------------------------------------------------
  // ------------------------------------------------
  // SYNC
  // ------------------------------------------------
  // ------------------------------------------------

  // Todo: Coordinate this with other entities
  autoSync$ = createEffect(() => this.store.select(LoginSelectors.isOffline).pipe(
    filter(isOffline => !isOffline),
    withLatestFrom(this.store.select(MaterialOfflineSelectors.nextAction)),
    filter(([_, type]) => type !== OfflineRequestType.None),
    map(_ => MaterialActions.offline.sync.syncAll())
  ))


  syncAll$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.offline.sync.syncAll),
    concatMap(_ => of(
      MaterialActions.offline.sync.created.syncAll(),
      MaterialActions.offline.sync.requested.syncAll(),
      MaterialActions.offline.sync.updated.syncAll(),
      MaterialActions.offline.sync.deleted.syncAll(),
    ))
  ));

  // --------------------------------------------------------------
  //  Created

  syncCreatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.offline.sync.created.syncAll),
    concatMap(_ => this.store.select(MaterialOfflineSelectors.created.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((id) => MaterialActions.offline.sync.created.byId({ input: id }))
      )),
    ))
  ));

  syncCreatedById$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.offline.sync.created.byId),
    concatMap(({ input }) => // Espera até que a pasta em que o material se encontra tenha sido sincronizada com o servidor
      this.store.select(MaterialSelectors.byId(input.id)).pipe(
        filter(material => material.folder < 1600000000000),
        take(1),
        withLatestFrom(of({ input })) // salva o input para utilizar a seguir, mantendo a compatibilidade com o código anterior
      )
    ),
    concatMap(([_, { input: { id, groupId } }]) => this.store.select(MaterialSelectors.byId(id)).pipe(
      take(1),
      concatMap((material) => material.files.length > 0
        ? this.fileApi.getFile<Blob>(material.files[0]).pipe(
          map(file => ({ material, file }))
        )
        : of({ material, file: null })
      ),
      map(({ material, file }) => {

        let createAction: Action = MaterialActions.create.link.request({
          input: {
            courseId: groupId,
            body: material,
            folderId: material.folder
          }
        })

        if (file) {
          createAction = MaterialActions.create.files.request({
            input: {
              courseId: groupId,
              files: [file],
              folderId: material.folder
            }
          })
        }

        return [
          MaterialActions.basic.remove.one({ data: id }),
          MaterialActions.offline.created.remove.one({ data: id }),
          createAction
        ];
      }),
      concatMap(actions => of(...actions))
    ))
  ));

  // --------------------------------------------------------------
  //  Requested

  syncRequestedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.offline.sync.requested.syncAll),
    concatMap((_) => this.store.select(MaterialOfflineSelectors.requested.groups).pipe(
      take(1),
      concatMap(groups => of(...groups).pipe(
        map(groupId => MaterialActions.offline.sync.requested.groupById({ input: { groupId } }))),
      ),
    ))
  ));

  syncRequestedGroupById$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.offline.sync.requested.groupById),
    map(({ input: { groupId } }) => [
      MaterialActions.offline.requested.groupIds.remove.one({ data: groupId }),
      MaterialActions.fetchAll.request({
        input: {
          courseId: groupId
        }
      })
    ]),
    concatMap(actions => of(...actions))
  ));

  // --------------------------------------------------------------
  //  Updated

  syncUpdatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.offline.sync.updated.syncAll),
    concatMap((_) => this.store.select(MaterialOfflineSelectors.updated.ids).pipe(
      take(1),
      concatMap(ids => of(...ids).pipe(
        map(id => MaterialActions.offline.sync.updated.byId({ input: id }))),
      ),
    ))
  ));


  syncUpdatedById$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.offline.sync.updated.byId),
    concatMap(({ input }) => // Espera até que a pasta em que o material se encontra tenha sido sincronizada com o servidor
      this.store.select(MaterialSelectors.byId(input.id)).pipe(
        filter(material => material.folder < 1600000000000),
        take(1),
        withLatestFrom(of({ input })) // salva o input para utilizar a seguir, mantendo a compatibilidade com o código anterior
      )
    ),
    concatMap(([_, { input }]) => this.store.select(MaterialSelectors.byId(input.id)).pipe(
      take(1),
      map(material => {
        return { input, material }
      })
    )),
    map(({ input, material }) => {

      const changeMaterialFolderInput = {
        materialId: material.id,
        courseId: input.groupId,
        folderId: material.folder
      }

      this.store.dispatch(MaterialActions.changeMaterialFolder.request({ input: changeMaterialFolderInput }))

      // apenas dispacha edição de material se for um link
      if(material.files.length == 0) {
        this.actions$.pipe(
          ofType(MaterialActions.changeMaterialFolder.success, MaterialActions.changeMaterialFolder.error),
          filter(({ input }) => input == changeMaterialFolderInput),
          take(1), // apenas termina o observavel caso ocorra erro
          ofType(MaterialActions.changeMaterialFolder.success),
        ).subscribe(() => {
          this.store.dispatch(MaterialActions.editLink.request({
            input: {
              materialId: material.id,
              courseId: input.groupId,
              body: fromSMToMaterialForm(material)
            }
          }))
        });
      }

      return MaterialActions.offline.updated.remove({ data: input })
    })
  ));


  // --------------------------------------------------------------
  //  Deleted

  syncDeletedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.offline.sync.deleted.syncAll),
    concatMap(_ => this.store.select(MaterialOfflineSelectors.deleted.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((input) => MaterialActions.offline.sync.deleted.byId({ input }))
      )),
    ))
  ));

  syncDeletedById$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialActions.offline.sync.deleted.byId),
    map(({ input }) => [
      MaterialActions.offline.deleted.remove({ data: input }),
      MaterialActions.delete.request({
        input: {
          materialId: input.id,
          courseId: input.groupId
        }
      })
    ]),
    concatMap(actions => of(...actions))
  ));

  constructor(private actions$: Actions, private store: Store<AppState>, private fileApi: FileApiService) { }
}
