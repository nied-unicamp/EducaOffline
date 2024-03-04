import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginData } from 'src/app/models/login-data';
import { RegisterFinish } from 'src/app/models/register';
import { LoginService } from './../login.service';
import { Subscription } from 'rxjs';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { Actions, ofType } from '@ngrx/effects';
import { LoginActions } from 'src/app/state/login/login.actions';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy  {

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private translationService: TranslationService,
    private actions: Actions
  ) {
  }

  loginData: LoginData;
  loginForm: FormGroup;
  registerFinish: RegisterFinish;
  returnUrl: string;

  errorMessage = '';
  registerOK = false;

  emailIsFocused = false;
  show = false;

  private translationSubscription: Subscription | undefined;
  translationText: typeof LANGUAGE.login.LoginComponent;

  /**
   * Store the error messages to be shown for each form input.
   *
   */
  formErrors = {
    userEmail: '',
    password: ''
  };


  ngOnInit(): void {

    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.login.LoginComponent
      }
    );

    // Get return url from route parameters
    this.route.queryParams.subscribe(params => {

      const language: string = this.translationService.getLanguageCode();

      this.returnUrl = params.returnUrl || '';

      this.registerFinish = {
        email: params['email'] || '',
        hash: params['hash'] || '',
        language
      }
    });

    this.newLoginData();

    if (this.registerFinish.email !== '' && this.registerFinish.hash !== '') {
      this.loginService.registerFinish(this.registerFinish).subscribe(data => {
        this.registerOK = true;
        console.log('finishing registration...')
      });
    }
    this.translationService.changeToBrowserLanguage();

    this.actions.pipe(
      ofType(LoginActions.me.success),
      tap(input => this.translationService.setTranslationByCode(input.data.language))
    ).subscribe();
  }

  ngOnDestroy(): void {
      this.translationSubscription.unsubscribe();
  }

  showPassword() {
    this.show = !this.show;
  }

  onSubmit() {
    this.loginData = {
      userEmail: this.loginForm.controls['userEmail'].value,
      password: this.loginForm.controls['password'].value
    }

    // Send login data
    this.loginService.login(this.loginData).subscribe({
      next: (data) => {
        this.router.navigate([this.returnUrl]);
      },
      error: () => {
        this.errorMessage = this.translationText.loginError;
      }
    });
  }

  newLoginData() {
    this.loginData = {} as LoginData;

    this.buildForm();
  }

  buildForm(): void {

    this.loginForm = this.fb.group({
      userEmail: [
        { value: this.registerFinish.email, disabled: this.registerFinish.email !== '' },
        [Validators.required, Validators.minLength(3), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
}
