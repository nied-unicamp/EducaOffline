import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivitySubmission, ActivitySubmissionForm, SubmissionFile } from 'src/app/models/activity-submission.model';
import { Activity } from 'src/app/models/activity.model';
import { Course } from 'src/app/models/course.model';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { ActivitiesApiService } from 'src/app/services/api/activities.api.service';
import { ActivitySubmissionActions } from 'src/app/state/activity-submission/activity-submission.actions';
import { FormWithFiles } from 'src/app/templates/form';
import { ActivitiesService } from '../../activities.service';
import { LoginSelectors } from 'src/app/state/login/login.selector';
import { concatMap, filter, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { ActivityItemSelectors } from 'src/app/state/activity-item/activity-item.selector';
import { FileUploaded } from 'src/app/models/file-uploaded.model';
import { FileUploadedSelectors } from 'src/app/state/file-uploaded/file-uploaded.selector';
import { getFileId } from 'src/app/state/file-uploaded/file-uploaded.state';
import { FileUploadedActions } from 'src/app/state/file-uploaded/file-uploaded.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, Subscription, of } from 'rxjs';
import { ActivitySubmissionOfflineActions } from 'src/app/state/activity-submission/offline/activity-submission.offline.actions';
import { LoginActions } from 'src/app/state/login/login.actions';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';


@Component({
  selector: 'app-activities-submission-create',
  templateUrl: './activities-submission-create.component.html',
  styleUrls: ['./activities-submission-create.component.css']
})
export class ActivitiesSubmissionCreateComponent extends FormWithFiles<ActivitySubmission> implements OnInit, OnDestroy{

  translationText: typeof LANGUAGE.activities.ActivitiesSubmissionCreateComponent;
  private translationSubscription: Subscription | undefined;

  form: FormGroup;

  activityId: number;
  userId: number;

  @Input() submission: ActivitySubmission;
  @Input() editing: boolean;
  @Input() files: FileUploaded[];
  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() editingChange: EventEmitter<boolean> = new EventEmitter();
  oldFiles: FileUploaded[];
  oldFilesIds: string[];
  isOffline: boolean;
  filesBeforeOffline: SubmissionFile;

  constructor(private injector: Injector,
    private activitiesApi: ActivitiesApiService,
    private store: Store,
    private sharedService: SharedService,
    private actions: Actions,
    private translationService: TranslationService
  ) {
    super(injector);
    this.route.data.subscribe((data: { course: Course, activity: Activity }) => {
      this.activityId = data.activity.id;
      this.courseId = data.course.id;

    });
    this.store.select(LoginSelectors.loggedUserId).pipe(
      map((id) => this.userId = id)
    );
    this.store.select(LoginSelectors.isOffline).subscribe((isOff) => this.isOffline = isOff)
    /*
    this.actions.pipe(
      ofType(LoginActions.setOffline),
      tap((action) => console.log(action)),
      filter((offline) => offline.isOffline),
      map((isOffline) => {
        this.filesBeforeOffline = {
            id: this.submission.id,
            files: this.files.map(file => getFileId(file))
        }
        console.log("salvando arquivos antigos!")
        return this.store.dispatch(ActivitySubmissionOfflineActions.filesChanged.current.add.one({ data: this.filesBeforeOffline }))
        }
      )
    )   
    */
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.activities.ActivitiesSubmissionCreateComponent
      }
    );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  buildForm() {
    if (this.editing) {
      this.oldFiles = this.files.map((file)=>file);
      this.oldFilesIds = this.oldFiles.map((file)=>getFileId(file));
    }
    return this.fb.group({
      answer: [this.value?.answer, Validators.required],
      files: [undefined]
    });
  }

  protected setFilesObservable() {
    this.filesObservable = this.activitiesApi.getSubmissionFiles(this.courseId, this.activityId);
  }

  valuePointer() {
    this.activityId = (this.routeData.activity as Activity)?.id;

    return this.submission;
  }

  protected getBlank() {
    return {} as ActivitySubmission;
  }


  create() {
    const form = this.form.value;
    console.log(form)
    this.store.dispatch(ActivitySubmissionActions.create.request({
      input: {
        form: form,
        courseId: this.courseId,
        activityId: this.activityId,
        userId: this.userId
      }
    }))

  }

  edit() {
    this.userId = this.submission.createdBy.id
    const form: ActivitySubmissionForm = this.form.value;
    // files ids updated by the user
    const filesIds: string[] = this.files.map((file) => getFileId(file))
    // new files ids that was setted considering the files not removed
    const mantainedFilesIds: string[] = this.oldFilesIds.filter(file => filesIds.includes(file)) ?? []

    const filesToDelete = this.oldFiles.filter(file => !filesIds.includes(getFileId(file))) as FileUploaded[] ?? []

    console.log(filesToDelete)

    // remove from store file ids that was removed 
    this.store.dispatch(ActivitySubmissionActions.basic.update.one({ data: { id: this.submission.id, changes: { files: [...mantainedFilesIds] } } }))
    
    if (filesToDelete.length > 0) {
      filesToDelete.forEach((file) => {
        this.store.dispatch(ActivitySubmissionActions.deleteFile.request({ 
          input: { 
            courseId: this.courseId,
            activityId: this.activityId,
            submissionId: this.submission.id,
            fileName: file.fileName,
            fileId: getFileId(file)
          }
        }))
        this.store.dispatch(FileUploadedActions.local.database.remove.request({
          input: {
            id: getFileId(file),
            deleteAll: true
          }
        }))
      })
      if (!this.isOffline) {
        this.actions.pipe(
          ofType(
            ActivitySubmissionActions.deleteFile.success
          ),
          take(1),
          tap(({ input }) => {
            console.log("Delete file success catched!")
  
            this.store.dispatch(ActivitySubmissionActions.edit.request({
              input: {
                form: form,
                courseId: this.courseId,
                activityId: this.activityId,
                userId: this.userId,
                submissionId: this.submission.id
              }
            }))
            console.log('user id '+this.userId)
            this.store.dispatch(ActivitySubmissionActions.listFiles.request({
              input: {
                courseId: this.courseId,
                activityId: this.activityId,
                submissionId: this.submission.id,
                userId: this.userId
              }
            }))
          }),
        ).subscribe();
      }
      
    }
    if (filesToDelete.length == 0 || this.isOffline){

      this.store.dispatch(ActivitySubmissionActions.edit.request({
        input: {
          form: form,
          courseId: this.courseId,
          activityId: this.activityId,
          userId: this.userId,
          submissionId: this.submission.id
        }
      }))
      console.log('user id'+this.userId)
      this.store.dispatch(ActivitySubmissionActions.listFiles.request({
        input: {
          courseId: this.courseId,
          activityId: this.activityId,
          submissionId: this.submission.id,
          userId: this.userId
        }
      }))
    }
    
  }

  submit() {
    if (this.editing) {
      this.edit()
      this.editing = false;
      this.editingChange.emit(this.editing)
    } else {
      this.create()
    }
  }
  cancelEdit() {
    this.cancel.emit();
  }

  closeEdit() {
    this.editing = false;
    this.editingChange.emit(this.editing)
  }
}
