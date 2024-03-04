import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { MaterialApiService } from "src/app/services/api/material.api.service";
import { MaterialFolderActions } from "./material-folder.actions";
import { catchError, concatMap, filter, map, withLatestFrom } from "rxjs/operators";
import { of } from "rxjs";
import { LoginSelectors } from "../login/login.selector";
import { MaterialActions } from "../material/material.actions";

@Injectable()
export class MaterialFolderEffects {

  load$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.fetchAll.request),
    concatMap(({ input }) => this.materialApiService.getFolders(input.courseId).pipe(
      map(folders => MaterialFolderActions.fetchAll.success({ input, data: folders })),
      catchError((error: any) => of(MaterialFolderActions.fetchAll.error({ input, error })))
    ))
  ))

  loadOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.fetchAll.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) => MaterialFolderActions.fetchAll.offlineError({ input, error, info: { } }))
  ));

  fetchMaterialsOfFolders = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.fetchAll.success),
    concatMap(({ input, data }) => of(...data).pipe(
      map(folder => MaterialActions.fetchFolderMaterials.request({
        input: {
          courseId: input.courseId,
          folderId: folder.id
        }
      })),
    )),
  ));

  create$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.create.request),
    concatMap(({ input }) => this.materialApiService.createFolder(input).pipe(
      map(data => MaterialFolderActions.create.success({ input, data })),
      catchError((error: any) => of(MaterialFolderActions.create.error({ input, error })))
    ))
  ));

  createOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.create.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) => {
      const date = new Date();
      const info = { id: date.getTime() };

      return MaterialFolderActions.create.offlineError({ input, error, info })
    })
  ));

  edit$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.edit.request),
    concatMap(({ input }) => this.materialApiService.editFolder(input).pipe(
      map(data => MaterialFolderActions.edit.success({ input, data })),
      catchError((error: any) => of(MaterialFolderActions.edit.error({ input, error })))
    ))
  ));

  editOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.edit.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) => // No need for info cause folder already exists (just updating)
      MaterialFolderActions.edit.offlineError({ input, error, info: {} })
    )
  ));

  delete$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.delete.request),
    concatMap(({ input }) => {
      if (input.folderId > 1600000000000) { // folder created offline and not yet sent to api
        return of([
          MaterialFolderActions.basic.remove.one({ data: input.folderId }),
          MaterialFolderActions.offline.created.remove.one({ data: input.folderId })
        ])
      }
      else { // folder already present in the server database
        return this.materialApiService.deleteFolder(input).pipe(
          map(data => [MaterialFolderActions.delete.success({ input, data })]),
          catchError((error: any) => of([MaterialFolderActions.delete.error({ input, error })]))
        )
      }
    }),
    concatMap(actions => of(...actions))
  ));

  deleteOfflineError$ = createEffect(() => this.actions$.pipe(
    ofType(MaterialFolderActions.delete.error),
    withLatestFrom(this.store.select(LoginSelectors.isOffline)),
    filter(([_, offline]) => offline),
    map(([{ input, error }, _]) => MaterialFolderActions.delete.offlineError({ input, error, info: {} }))
  ));

  constructor(private actions$: Actions, private materialApiService: MaterialApiService, private store: Store) { }
}