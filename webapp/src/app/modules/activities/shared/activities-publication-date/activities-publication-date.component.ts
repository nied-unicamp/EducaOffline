import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n, I18n } from 'src/app/modules/shared/injectables/CustomDatepickerI18n';
import { CustomControl } from 'src/app/templates/custom-control';

@Component({
  selector: 'app-activities-publication-date',
  templateUrl: './activities-publication-date.component.html',
  styleUrls: ['./activities-publication-date.component.css'],
  providers: [I18n,
    {
      provide: NgbDatepickerI18n,
      useClass: CustomDatepickerI18n
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ActivitiesPublicationDateComponent),
      multi: true
    }]
})
export class ActivitiesPublicationDateComponent extends CustomControl<NgbDate> {

  hoveredDate: NgbDate;

  today: NgbDate;

  closeOnSelection = true;

  constructor(private calendar: NgbCalendar) {
    super();
    this.today = calendar?.getToday();
  }

  onDateSelection(date: NgbDate) {
    if (date && this.isSelectable(date)) {
      this.value = date;
      this.onChange(this.value);
    }
  }

  isSelectable(date: NgbDate) {
    return date.equals(this.today) || date.after(this.today);
  }

  isSelected(date: NgbDate) {
    return date.equals(this.value);
  }

  isToday(date: NgbDate): boolean {
    return date.equals(this.today);
  }

  isInvalid(date: NgbDate): boolean {
    return date.before(this.today);
  }

  isHovered(date: NgbDate) {
    return date.equals(this.hoveredDate);
  }
}
