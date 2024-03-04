import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { User } from 'src/app/models/user.model';
import { ProfileService } from '../profile.service';
import { Subscription } from 'rxjs';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { Store } from '@ngrx/store';
import { UserActions } from 'src/app/state/user/user.actions';
import { Actions, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-personal-data-edit',
  templateUrl: './profile-personal-data-edit.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./profile-personal-data-edit.component.css']
})

export class ProfilePersonalDataEditComponent implements OnInit, OnDestroy {

  @Input() profile: User;
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  urlPhoto: string;
  aboutMeNumCharsTyped: number;
  aboutMeNumCharsTypedColor: string;
  aboutMeErrorMaxNumCharsExceeded = false;

  /**
   * Max number of chars allowed for aboutMe.
   * If change, change too in src/app/dev/languages.ts => 'profile' => 'ProfilePersonalDataEditComponent'
   */
  aboutMeMaxNumChars = 1000;

  /**
   * Max number of chars allowed .
   * If change, change too in src/app/dev/languages.ts
   * => 'profile' => 'ProfilePersonalDataEditComponent'
   */
  nameMaxNumChars = 100;

  // image cropper
  fileImage: Blob;
  croppedImage: any;
  showCroppedImage = false;
  imageChangedEvent: any;

  translationTextDataEdit: typeof LANGUAGE.profile.ProfilePersonalDataEditComponent;
  translationTextActions: typeof LANGUAGE.profile.actions;
  private translationSubscription: Subscription | undefined;

  actions = ProfileService.translationText.actions;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private translationService: TranslationService,
    private store: Store,
    private actions$: Actions,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationTextDataEdit = translation.profile.ProfilePersonalDataEditComponent
        this.translationTextActions = translation.profile.actions
      }
 	  );
    this.form = this.fb.group({
      name: [this.profile.name, [
        Validators.required,
        Validators.maxLength(this.nameMaxNumChars)
      ]],
      aboutMe: [this.profile.aboutMe, [
        Validators.maxLength(this.aboutMeMaxNumChars)
      ]]
    });

    if (this.profile.aboutMe) {
      this.aboutMeNumCharsTyped = this.profile.aboutMe.length;
    } else {
      this.aboutMeNumCharsTyped = 0;
    }

    if (this.profile.picture) {
      this.urlPhoto = this.profileService.getProfilePhoto(this.profile?.id);
    } else {
      this.urlPhoto = null;
    }
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  aboutMeSetNumberChars(txt: string) {
    this.aboutMeNumCharsTyped = txt.length;
    if (this.aboutMeNumCharsTyped > this.aboutMeMaxNumChars) {
      this.aboutMeNumCharsTypedColor = 'danger';
    } else {
      this.aboutMeNumCharsTypedColor = 'primary';
    }
  }

  onSubmit() {
    console.log('updating profile...');

    this.store.dispatch(UserActions.editProfile.request({
      input: {
        id: this.profile.id,
        form: this.form.value
      }
    }))

    this.actions$.pipe(
      ofType(UserActions.editProfile.success),
      map(({ input }) => {
        if (this.showCroppedImage) {
          const file = new File([this.fileImage], 'profile.jpeg', { lastModified: (new Date()).getTime(), type: 'image/jpeg' });
  
          this.profileService.updateProfilePhoto(input.id, file).subscribe(_ => {
            console.log('updating photo...');
          });
        } else if (!this.urlPhoto) {
          this.profileService.deleteProfilePhoto(input.id).subscribe(_ => {
            console.log('deleting photo...');
          })
        }
        console.log('navigating')
      })
    ).subscribe();

    this.cancel.emit();
  }

  //
  // Image Cropper
  //
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.fileImage = base64ToFile(event.base64);

    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

}
