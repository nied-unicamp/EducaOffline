import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterStart } from 'src/app/models/register';
import { User } from 'src/app/models/user.model';
import { RegisterService } from './../register.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { Subscription } from 'rxjs';

export const passwordsDontMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const newPassword = control.get('password');
  const repeatPassword = control.get('repeat_password');

  return (newPassword && repeatPassword && newPassword.value !== repeatPassword.value)
    ? { passwordsDontMatch: true }
    : null;
};

@Component({
  selector: 'app-register',
  providers: [RegisterService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  @Output() response: EventEmitter<any> = new EventEmitter<any>();

  active = true;
  registerOK = false;
  translationText: typeof LANGUAGE.register.RegisterComponent;
  private translationSubscription: Subscription | undefined;

  registerForm: FormGroup;
  user: User;
  registerInit: RegisterStart;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.register.RegisterComponent
      }
 	  );
    this.newUser();
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  newUser() {
    this.user = {} as User;
    this.buildForm();

    this.active = false;
    setTimeout(() => this.active = true, 0);
  }

  /**
   * Build form with the FormBuild object, with an item for each input,
   * specifying the start value and validators used. Then, watch for changes.
   *
   * Note that the input names, such as 'passwd', must be the same as the attributes
   * from the user model, for compatibility.
   */
  buildForm(): void {
    const control = new FormControl('bad@', Validators.email);

    this.registerForm = this.fb.group({
      email: [this.user?.email, [
        Validators.required,
        Validators.email
      ]],
      name: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      repeat_password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    }, {
      validators: [passwordsDontMatchValidator]
    });
  }

  onSubmit() {
    const language: string = this.translationService.getLanguageCode()

    this.registerInit = {
      email: this.registerForm.controls['email'].value,
      name: this.registerForm.controls['name'].value,
      password: this.registerForm.controls['password'].value,
      language
    };

    this.registerService.registerStart(this.registerInit).subscribe(data => {
      this.registerOK = true;
    });
  }
}
