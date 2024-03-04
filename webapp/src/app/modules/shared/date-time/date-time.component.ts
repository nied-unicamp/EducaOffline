import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
// eslint-disable-next-line max-len
import { AbstractControl, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { CustomControl } from 'src/app/templates/custom-control';


@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateTimeComponent),
      multi: true
    }
  ]
})
export class DateTimeComponent extends CustomControl<Date> implements Validator, OnInit, OnDestroy {

  onTouched;
  onChange;

  private translationSubscription: Subscription | undefined;
  translationText: typeof LANGUAGE.shared.time;

  constructor(
    private datePipe: DatePipe,
    private translationService: TranslationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
          (translation) => {
            this.translationText = translation.shared.time
          }
       );
  }
  
  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  public form: FormGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    time: new FormControl(null, [Validators.required])
  });

  getDate(): Date {
    if (this.form.valid) {
      return this.toDate(this.form.controls['date'].value, this.form.controls['time'].value);
    }

    return null;
  }

  isEmpty() {
    return (this.form.controls['date'].value === null && this.form.controls['time'].value === null);
  }

  /******** ControlValueAccessor ********/

  writeValue(obj: Date): void {
    this.form.controls['date'].setValue(this.toDay(obj), { emitEvent: false });
    this.form.controls['time'].setValue(this.toTime(obj), { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe(_ => {
      fn(this.getDate());
    });
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(c: AbstractControl): ValidationErrors | null {

    return (this.getDate() || this.isEmpty()) ?
      null :
      {
        invalidForm: {
          valid: false,
          message: 'Date and/or time fields are invalid'
        }
      };
  }


  /******** Conversion ********/

  private toTime(date: Date): string {
    return this.datePipe.transform(date, 'HH:mm');
  }

  private toDay(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  private toDate(date: string, time: string): Date {
    const myDate = date.split('-');
    const myTime = time.split(':');

    const newDate = new Date(Number(myDate[0]), Number(myDate[1]) - 1, Number(myDate[2]), Number(myTime[0]), Number(myTime[1]));
    return newDate;
  }
}
