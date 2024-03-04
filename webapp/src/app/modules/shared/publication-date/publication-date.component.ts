import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
// eslint-disable-next-line max-len
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { SharedService } from './../shared.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-publication-date',
  templateUrl: './publication-date.component.html',
  styleUrls: ['./publication-date.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PublicationDateComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PublicationDateComponent),
      multi: true
    }
  ]
})
export class PublicationDateComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {

  // Inner form
  form: FormGroup;


  /**
   * Translated text for the component
   *
   */
  translationText: typeof LANGUAGE.shared.PublicationDateComponent;
  private translationSubscription: Subscription | undefined;

  // ControlValueAccessor variables
  onBlur: () => void;
  onChange: (value: Date) => void;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private translationService: TranslationService
  ) {

    this.buildForm();
  }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
          (translation) => {
            this.translationText = translation.shared.PublicationDateComponent
          }
    );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  buildForm() {
    this.form = this.fb.group({
      type: [null, Validators.required],
      date: [, []]
    });

    // Subscribe to changes (inner form)
    this.watchChanges();

    // Subscribe to changes (outer form)
    this.form.valueChanges.subscribe(_ => {
      this.onChange(this.form.value.date);
    });
  }

  watchChanges() {
    this.form.controls['type'].valueChanges.subscribe((value: any) => {
      if (value === 'draft') {
        this.form.controls['date'].setValue(null);
      } else if (value === 'now') {
        this.form.controls['date'].setValue(new Date());
      }
    });
  }




  /********* ControlValueAccessor Interface  ***********/

  writeValue(obj: Date): void {
    if (!obj) {
      this.form.controls['type'].setValue(null, { emitEvent: false });
      this.form.controls['date'].setValue(null, { emitEvent: false });
    } else {
      this.form.controls['type'].setValue('schedule', { emitEvent: false });
      this.form.controls['date'].setValue(obj, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onBlur = fn;
  }

  /************* Validator Interface *************/

  validate(control: AbstractControl): ValidationErrors {
    if (this.form.controls['date'].valid) {
      return null;
    }

    return {
      invalidForm: {
        valid: false,
        message: 'Date is invalid'
      }
    };
  }
}
