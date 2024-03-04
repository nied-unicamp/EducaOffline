import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-login-forgot-password',
  templateUrl: './login-forgot-password.component.html',
  styleUrls: ['./login-forgot-password.component.css']
})
export class LoginForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  translationText: typeof LANGUAGE.login.LoginForgotPasswordComponent;
  private translationSubscription: Subscription | undefined;

  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.login.LoginForgotPasswordComponent
      }
 	  );
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  buildForm(): void {
    const control = new FormControl('bad@', Validators.email);

    this.forgotPasswordForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
    });
  }

  onSubmit() {
    this.loginService.forgotPassword(this.forgotPasswordForm.value).subscribe(data => {
      if (data) {
        this.errorMessage = this.translationText.errorMessage;
        this.successMessage = '';
      } else {
        this.errorMessage = '';
        this.successMessage = this.translationText.successMessage;

        // this.router.navigate(['/courses']);
      }
    });
  }
}