import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, filter, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { FileApiService } from 'src/app/services/api/file.api.service';
import { MaterialSelectors } from 'src/app/state/material/material.selector';
import { LoginSelectors } from '../../login/login.selector';
import { OfflineRequestType } from '../../shared/offline/offline.state';
import { AppState } from '../../state';
import { MaterialFolderOfflineActions } from './material-folder.offline.actions';
import { MaterialFolderOfflineSelectors } from './material-folder.offline.selector';
import { MaterialFolderActions } from '../material-folder.actions';
import { MaterialFolderSM, fromSMToMaterialFolderForm } from 'src/app/models/material-folder.model';
import { MaterialFolderSelectors } from '../material-folder.selector';
import { MaterialActions } from '../../material/material.actions';
import { MaterialOfflineSelectors } from '../../material/offline/material.offline.selector';

@Injectable()
export class MaterialFolderOfflineEffects {

  // tentou acessar os materiais enquanto estava offline,
  // salva para fazer fetchAll assim que voltar a internet.
  loadOffline = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.fetchAll.offlineError),
    map(({input}) => MaterialFolderActions.offline.requested.groupIds.add.one({data: input.courseId}))
  ))

  createFolderOffline$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.create.offlineError),
    map(({ input, info }) => {
      const folderSM = {
        id: info.id,
        title: input.body.title,
        description: input.body.description
      } as MaterialFolderSM;

      return MaterialFolderOfflineActions.meta.addOfflineFolder({
        idAndGroup: {
          id: info.id,
          groupId: input.courseId
        },
        folder: folderSM
      });
    }),
  ));

  editFolderOffline$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.edit.offlineError),
    concatMap(({ input }) => this.store.select(MaterialFolderSelectors.byId(input.folderId)).pipe(
      take(1), // needs to take only one because when the object is updated the observer sends another value
      map(folder => {
        // updates the title and description, keeping the remaining information
        const editedFolder = {
          ...folder,
          title: input.body.title,
          description: input.body.description ?? ""
        }

        const idAndG = {
          id: input.folderId,
          groupId: input.courseId
        };

        return [
          MaterialFolderOfflineActions.meta.editOffline({
            idAndGroup: idAndG,
            folder: editedFolder
          }),
          // Only marks to update later if the link is already present in server database
          (folder.id < 1600000000000) ? MaterialFolderOfflineActions.updated.add({ data: idAndG }) : null,
        ].filter(Boolean);
      }),
      concatMap(actions => of(...actions))
    )),
  ));

  deleteOffline$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.delete.offlineError),
    map(({ input }) => MaterialFolderActions.offline.deleted.add({
      data: {
        groupId: input.courseId,
        id: input.folderId
      }
    }))
  ));

  markMaterialFolderAsCreatedOffline$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.offline.meta.addOfflineFolder),
    map(({ idAndGroup }) => MaterialFolderOfflineActions.created.add.one({ data: idAndGroup }))
  ));

  // ------------------------------------------------
  // ------------------------------------------------
  // SYNC
  // ------------------------------------------------
  // ------------------------------------------------

  // Todo: Coordinate this with other entities
  autoSync$ = createEffect(() => this.store.select(LoginSelectors.isOffline).pipe(
    filter(isOffline => !isOffline),
    withLatestFrom(this.store.select(MaterialFolderOfflineSelectors.nextAction)),
    filter(([_, type]) => type !== OfflineRequestType.None),
    map(_ => MaterialFolderActions.offline.sync.syncAll())
  ))


  syncAll$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.offline.sync.syncAll),
    concatMap(_ => of(
      MaterialFolderActions.offline.sync.created.syncAll(),
      MaterialFolderActions.offline.sync.requested.syncAll(),
      MaterialFolderActions.offline.sync.updated.syncAll(),
      MaterialFolderActions.offline.sync.deleted.syncAll(),
    ))
  ));

  // --------------------------------------------------------------
  //  Created

  syncCreatedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.offline.sync.created.syncAll),
    concatMap(_ => this.store.select(MaterialFolderOfflineSelectors.created.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((id) => MaterialFolderActions.offline.sync.created.byId({ input: id }))
      )),
    ))
  ));

  syncCreatedById$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.offline.sync.created.byId),
    concatMap(({ input: { id, groupId } }) => this.store.select(MaterialFolderSelectors.byId(id)).pipe(
      take(1),
      map((folder) => {

        const requestInput = {
          courseId: groupId,
          body: folder
        }

        this.store.dispatch(MaterialFolderActions.create.request({ input: requestInput }))

        this.actions$.pipe(
          ofType(MaterialFolderActions.create.success, MaterialFolderActions.create.error),
          filter(({ input }) => input == requestInput),
          take(1), // apenas termina o observavel caso ocorra erro
          ofType(MaterialFolderActions.create.success),
        ).subscribe(({ data }) => {
          this.store.dispatch(MaterialActions.updateFolderReferences({ oldFolderId: id, newFolderId: data.id }))
        });

        return [
          MaterialFolderActions.basic.remove.one({ data: id }),
          MaterialFolderActions.offline.created.remove.one({ data: id })
        ];
      }),
      concatMap(actions => of(...actions))
    ))
  ));

  // --------------------------------------------------------------
  //  Requested

  syncRequestedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.offline.sync.requested.syncAll),
    concatMap((_) => this.store.select(MaterialFolderOfflineSelectors.requested.groups).pipe(
      take(1),
      concatMap(groups => of(...groups).pipe(
        map(groupId => MaterialFolderActions.offline.sync.requested.groupById({ input: { groupId } }))),
      ),
    ))
  ));

  syncRequestedGroupById$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.offline.sync.requested.groupById),
    map(({ input: { groupId } }) => [
      MaterialFolderActions.offline.requested.groupIds.remove.one({ data: groupId }),
      MaterialFolderActions.fetchAll.request({
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
    ofType(MaterialFolderActions.offline.sync.updated.syncAll),
    concatMap((_) => this.store.select(MaterialFolderOfflineSelectors.updated.ids).pipe(
      take(1),
      concatMap(ids => of(...ids).pipe(
        map(id => MaterialFolderActions.offline.sync.updated.byId({ input: id }))),
      ),
    ))
  ));


  syncUpdatedById$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.offline.sync.updated.byId),
    concatMap(({ input }) => this.store.select(MaterialFolderSelectors.byId(input.id)).pipe(
      take(1),
      map(folder => {
        return { input, folder }
      })
    )),
    map(({ input, folder }) => [
      MaterialFolderActions.offline.updated.remove({ data: input }),
      MaterialFolderActions.edit.request({
        input: {
          folderId: folder.id,
          courseId: input.groupId,
          body: fromSMToMaterialFolderForm(folder)
        }
      })
    ]),
    concatMap(actions => of(...actions))
  ));


  // --------------------------------------------------------------
  //  Deleted

  syncDeletedSyncAll$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.offline.sync.deleted.syncAll),
    // Espera até que todos os updates sejam requisitados ao servidor
    concatMap(() =>
      this.store.select(MaterialOfflineSelectors.updated.count).pipe(
        filter(count => count == 0),
        take(1),
      )
    ),
    // Espera até que todos as transferencias de pastas sejam concluídas
    // assim garantindo que não há haverá items na pasta no servidor, permitindo que ela seja excluída.
    concatMap(() =>
      this.store.select(MaterialSelectors.selectChangingFoldersCount).pipe(
        filter(count => count == 0),
        take(1),
      )
    ),
    concatMap(_ => this.store.select(MaterialFolderOfflineSelectors.deleted.ids).pipe(
      take(1),
      concatMap((ids) => of(...ids).pipe(
        map((input) => MaterialFolderActions.offline.sync.deleted.byId({ input }))
      )),
    ))
  ));

  syncDeletedById$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.offline.sync.deleted.byId),
    concatMap(({ input }) => // Espera até que a pasta não tenha mais items, ou seja,
                             // que todos os seus items tenham sido apagados no servidor
      this.store.select(MaterialSelectors.folderHasItems(input.id)).pipe(
        filter(has => !has),
        take(1),
        withLatestFrom(of(input)) // Envia input junto para ser utilizado em seguida
      )
    ),
    map(([_, input]) => [
      MaterialFolderActions.offline.deleted.remove({ data: input }),
      MaterialFolderActions.delete.request({
        input: {
          folderId: input.id,
          courseId: input.groupId
        }
      })
    ]),
    concatMap(actions => of(...actions))
  ));

  constructor(private actions$: Actions, private store: Store<AppState>, private fileApi: FileApiService) { }
}
