import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { ProfileService } from '../profile.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';

export const passwordsDontMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const repeatPassword = control.get('repeatPassword');

  return (newPassword && repeatPassword && newPassword.value !== repeatPassword.value)
    ? { passwordsDontMatch: true }
    : null;
};

@Component({
  selector: 'app-profile-password-edit',
  templateUrl: './profile-password-edit.component.html',
  styleUrls: ['./profile-password-edit.component.css']
})
export class ProfilePasswordEditComponent implements OnInit, OnDestroy {

  @Input() profile: User;
  @Output() closeForm = new EventEmitter<void>();

  form: FormGroup;
  passwdMinLength = 8;
  oldPasswordDoNotMatch = false;

  actions = ProfileService.translationText.actions;

  translationText: typeof LANGUAGE.profile.ProfilePasswordEditComponent;
  private translationSubscription: Subscription | undefined;

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private translationService: TranslationService
  ) {
  }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.profile.ProfilePasswordEditComponent
      }
 	  );
    this.form = this.fb.group({
      // email: [{value: this.profile.getEmail(), disabled: true}],
      oldPassword: ['', [
        Validators.minLength(this.passwdMinLength), Validators.required
      ]],
      newPassword: ['', [
        Validators.minLength(this.passwdMinLength), Validators.required
      ]],
      repeatPassword: ['', [
        Validators.minLength(this.passwdMinLength), Validators.required
      ]]
    }, {
      validators: [passwordsDontMatchValidator]
    });
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  onSubmit() {
    console.log('editing password...');

    this.profileService.updateUserPassword(this.profile.id, this.form.value).subscribe(data => {
      if (data) {
        this.oldPasswordDoNotMatch = false;
        location.reload();
      } else {
        this.oldPasswordDoNotMatch = true;
        this.form.controls['oldPassword'].setValue('');
        this.form.controls['oldPassword'].markAsUntouched();
      }
    });
  }

  cancel() {
    this.form.reset({ oldPassword: '', newPassword: '', repeatPassword: '' });
    this.closeForm.emit();
  }
}
