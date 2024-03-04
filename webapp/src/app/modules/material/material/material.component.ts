import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { MaterialFolder } from 'src/app/models/material-folder.model';
import { Material } from 'src/app/models/material.model';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { MaterialFolderActions } from 'src/app/state/material-folder/material-folder.actions';
import { MaterialFolderAdvancedSelectors } from 'src/app/state/material-folder/material-folder.advanced.selector';
import { MaterialFolderSelectors } from 'src/app/state/material-folder/material-folder.selector';
import { MaterialFolderOfflineSelectors } from 'src/app/state/material-folder/offline/material-folder.offline.selector';
import { MaterialActions } from 'src/app/state/material/material.actions';
import { MaterialAdvancedSelectors } from 'src/app/state/material/material.advanced.selector';
import { MaterialSelectors } from 'src/app/state/material/material.selector';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';
import { selectRouteParam } from 'src/app/state/router/router.selector';


@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit, OnDestroy {

  materials$: Observable<Material[]>;
  folders$: Observable<MaterialFolder[]>;
  notDeletedFolders$: Observable<MaterialFolder[]>;

  canDelete$: Observable<boolean>;
  canUpload$: Observable<boolean>;

  folderId$: Observable<number>;

  folder$: Observable<MaterialFolder>;

  folderSyncSubscription: Subscription;

  constructor(
    private store: Store,
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private actions$: Actions
  ) { }

  ngOnInit() {
    this.folderId$ = this.store.select(selectRouteParam('folderId')).pipe(map((id: string) => id ? Number(id) : -1))
    this.folders$ = this.store.select(MaterialFolderAdvancedSelectors.sel.many(MaterialFolderSelectors.byCourse.current.all));
    this.folder$ = this.folderId$.pipe(switchMap((folderId: number) => this.store.select(MaterialFolderSelectors.byId(folderId))));

    this.notDeletedFolders$ = combineLatest([
      this.folders$,
      this.store.select(MaterialFolderOfflineSelectors.deleted.ids)
    ]).pipe(
      map(([folders, deletedIdAndGroups]) =>
        folders.filter(folder => !deletedIdAndGroups.some(({ id }) => id === folder.id))
      )
    );

    this.materials$ = this.store.select(MaterialAdvancedSelectors.sel.many(MaterialSelectors.byCourse.current.all));
    this.canDelete$ = this.store.select(ParticipationAdvancedSelectors.hasPermission('delete_material'));
    this.canUpload$ = this.store.select(ParticipationAdvancedSelectors.hasPermission('create_material'));

    this.folderId$.pipe(
      take(1),
      filter(id => id == -1),
      tap(() => this.fetchAll()),
    ).subscribe();

    // Se a pasta atual foi criada offline e acaba de ser sincronizada, troca a pasta selecionada e faz o roteamento
    this.folderSyncSubscription = this.actions$.pipe(
      ofType(MaterialActions.updateFolderReferences),
      withLatestFrom(this.folderId$),
      filter(([{ oldFolderId }, currentFolderId]) => currentFolderId === oldFolderId)
    ).subscribe(([{ newFolderId }, _]) => {
      this.router.navigate([`../${newFolderId}`], { relativeTo: this.activatedRoute });
    });
  }

  ngOnDestroy() {
    this.folderSyncSubscription.unsubscribe();
  }

  fetchAll() {
    this.store.select(CourseSelectors.currentId).pipe(
      filter(courseId => !!courseId),
      take(1),
      map(courseId => Number(courseId)),
      tap((courseId) => {
        this.store.dispatch(MaterialActions.fetchAll.request({ input: { courseId } }))
      }),
      tap((courseId) => {
        this.store.dispatch(MaterialFolderActions.fetchAll.request({ input: { courseId } }))
      }),
    ).subscribe();
  }

  trackMaterial(index: number, material: Material) {
    return material?.id;
  }

  trackFolder(index: number, folder: MaterialFolder) {
    return folder?.id;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // route back when ESC is pressed
    this.folderId$.pipe(take(1)).subscribe((currentFolderId) => {
      if (currentFolderId === -1 || this.modalService.hasOpenModals()) return;
      this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
    });
  }
}
