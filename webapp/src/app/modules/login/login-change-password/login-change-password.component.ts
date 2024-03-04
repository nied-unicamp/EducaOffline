import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';

export const passwordsDontMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const newPassword = control.get('password');
  const repeatPassword = control.get('repeat_password');

  return (newPassword && repeatPassword && newPassword.value !== repeatPassword.value)
    ? { passwordsDontMatch: true }
    : null;
};

@Component({
  selector: 'app-login-change-password',
  templateUrl: './login-change-password.component.html',
  styleUrls: ['./login-change-password.component.css']
})
export class LoginChangePasswordComponent implements OnInit, OnDestroy {

  changePasswordForm: FormGroup;
  translationText: typeof LANGUAGE.login.LoginChangePasswordComponent;
  private translationSubscription: Subscription | undefined;
  body: any;

  passwordChanged = false;

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.login.LoginChangePasswordComponent
      }
 	  );
    // Get return url from route parameters
    this.route.queryParams.subscribe(params => {

      this.body = {
        email: params['email'] || '',
        password: '',
        hash: params['hash'] || ''
      }
    });

    this.buildForm();
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  buildForm(): void {
    const control = new FormControl('bad@', Validators.email);

    this.changePasswordForm = this.fb.group({
      email: [this.body.email, [
        Validators.required, Validators.minLength(3), Validators.email
      ]],
      hash: [this.body.hash, Validators.required],
      password: ['', [
        Validators.minLength(8), Validators.required
      ]],
      repeat_password: ['', [
        Validators.minLength(8), Validators.required
      ]]
    }, {
      validators: [passwordsDontMatchValidator]
    });
  }

  onSubmit() {
    this.body.password = this.changePasswordForm.controls['password'].value;

    this.loginService.changePassword(this.body).subscribe(data => {
      console.log('changing password...');
      this.passwordChanged = true;

      setTimeout(() => {
        this.router.navigate(['login']);
      }, 4000);
    })
  }
}
