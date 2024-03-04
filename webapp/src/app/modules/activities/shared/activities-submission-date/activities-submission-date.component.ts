import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n, I18n } from 'src/app/modules/shared/injectables/CustomDatepickerI18n';
import { CustomControl } from 'src/app/templates/custom-control';


@Component({
  selector: 'app-activities-submission-date',
  templateUrl: './activities-submission-date.component.html',
  styleUrls: ['./activities-submission-date.component.css'],
  providers: [I18n,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ActivitiesSubmissionDateComponent),
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ActivitiesSubmissionDateComponent),
      multi: true
    }]
})
export class ActivitiesSubmissionDateComponent extends CustomControl<{ start: NgbDate, end: NgbDate }>
  implements Validator, OnChanges {

  @Input() publication: NgbDate;

  today: NgbDate;
  hoveredDate: NgbDate;
  closeOnSelection = true;

  // When some input from this component changes,
  // emit the CVA onChange so the custom control can be validated again
  ngOnChanges(changes: SimpleChanges): void {

    if (!changes.publication.isFirstChange()) {
      if (!this.value.start || this.value.start.before(this.publication)) {
        this.value.start = this.publication;
      }

      if (this.value.end && this.value.end.before(this.value.start)) {
        this.value.end = null;
      }
    }

    this.onChange(this.value);
  }

  constructor(private calendar: NgbCalendar) {
    super();

    this.today = calendar?.getToday();

    if (!(this.publication instanceof Date)) {
      this.publication = this.today;
    }

    this.value = {
      start: this.publication,
      end: null // calendar.getNext(this.publication, 'd', 7)
    };
  }

  onDateSelection(date: NgbDate) {
    if (this.isSelectable(date)) {
      if (!this.value.start && !this.value.end) {
        this.value.start = date;
      } else if (this.value.start && !this.value.end) {
        this.value.end = date;
      } else {
        this.value.end = null;
        this.value.start = date;
      }
    } else if (!this.isInvalid(date)) {
      this.value.start = date;
    }

    this.onChange(this.value);
  }

  isPublication(date: NgbDate) {
    return date.equals(this.publication);
  }

  isSelectable(date: NgbDate) {
    if (this.value.start && !this.value.end) {
      return date.equals(this.value.start) || date.after(this.value.start);
    }

    return date.equals(this.publication) || date.after(this.publication);

  }

  isToday(date: NgbDate): boolean {
    return date.equals(this.today);
  }

  isInvalid(date: NgbDate): boolean {
    return date.before(this.publication);
  }

  isHovered(date: NgbDate) {
    return this.value.start && !this.value.end && this.hoveredDate && date.after(this.value.start) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.value.start) && date.before(this.value.end);
  }

  isStart(date: NgbDate) {
    return date.equals(this.value.start);
  }

  isEnd(date: NgbDate) {
    return date.equals(this.value.end);
  }

  isRange(date: NgbDate) {
    return date.equals(this.value.start) || date.equals(this.value.end) || this.isInside(date);
  }

  validate(control: AbstractControl): ValidationErrors {

    const errors: ValidationErrors = {};

    if (!this.value) {
      errors.invalidValue = {
        valid: false,
        message: 'No value instantiated'
      };
    } else {
      if (!this.value.start) {
        errors.noStartValue = {
          valid: false,
          message: 'Start value is missing'
        };
      } else if (this.value.start.before(this.publication)) {
        errors.invalidStartValue = {
          valid: false,
          message: 'Period start is before the publication'
        };
      }

      if (!this.value.end) {
        errors.noEndValue = {
          valid: false,
          message: 'End value is missing'
        };
      } else if (this.value.start) {
        if (this.value.end.before(this.value.start)) {
          errors.invalidEndValue = {
            valid: false,
            message: 'Period end is before the period start'
          };
        }
      }
    }

    return errors;
  }
}
