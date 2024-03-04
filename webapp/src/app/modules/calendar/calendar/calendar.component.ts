import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarEvent, CalendarSnapshot } from 'src/app/models/calendar';
import { CalendarService } from './../calendar.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-calendar',
  styleUrls: ['./calendar.component.css'],
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit, OnDestroy{

  translationText: typeof LANGUAGE.calendar.CalendarComponent;
  private translationSubscription: Subscription | undefined;

  events: CalendarEvent[];
  calendar: CalendarSnapshot;

  isCollapsed = true;

  courseId: number

  constructor(
    private calendarService: CalendarService,
    private route: ActivatedRoute,
    private translationService: TranslationService
  ) {
    // Initiates the calendar
    this.calendar = new CalendarSnapshot(new Date());

    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));

    // Get the events
    this.calendarService.getCourseEvents(this.courseId).subscribe(data => {
      this.events = data;
    });
  }

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
          (translation) => {
            this.translationText = translation.calendar.CalendarComponent
          }
       );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  dayClicked(date: Date) {
    if (this.calendar.isDisplayedDate(date) && !this.isCollapsed) {
      this.isCollapsed = true;
    } else {
      if (this.getEvents(date).length > 0) {
        this.isCollapsed = false;
      } else {
        this.isCollapsed = true;
      }

      this.calendar.setDisplayedDate(date);
    }
  }


  /**
   * Get all the events that happen on a given date
   *
   * @param date - Date of analysis
   * @param onlyStartAndEnd=true - If false, show 'open' events too
   * @returns Array of events on a day
   */
  getEvents(date: Date, onlyStartAndEnd: boolean = true): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    if (this.events) {

      this.events.forEach(event => {
        if (event.endsToday(date) || event.startsToday(date) ||
          (event.isHappening(date) && !onlyStartAndEnd)
        ) {
          events.push(event);
        }
      });
    }
    return events;
  }


  /**
   * Set the CSS classes of each day
   *
   * @param date - Date to be styled
   * @returns - String of classes
   */
  cssDayString(date: Date): string {
    let out = 'col date';

    if (date.getDay() === 0 || (date.getDay() === 6)) {
      out += ' weekend';
    } else {
      out += ' workday';
    }

    if (!this.calendar.isSameMonth(date)) {
      out += ' otherMonth';
    }

    if (this.calendar.isDisplayedDate(date) && !this.isCollapsed) {
      out += ' selected';
    }

    if (this.isSameDay(date, new Date())) {
      out += ' today';
    }

    return out;
  }


  /**
   * Change the calendar view to today
   *
   */
  viewToday() {
    this.calendar.setDisplayedDate(new Date());
  }

  isSameDay(d0: Date, d1: Date) {
    return (d0.getFullYear() === d1.getFullYear()) &&
      (d0.getMonth() === d1.getMonth()) &&
      (d0.getDate() === d1.getDate());
  }


  /**
   * Get the dates to be displayed in the calendar
   *
   * @returns - Array of weeks
   */
  getDates(): Date[][] {
    const output: Date[][] = [];

    let array: Date[] = [];
    this.calendar.generateDateTable().forEach(item => {
      array.push(item);

      if (array.length === 7) {
        output.push(array);
        array = [];
      }
    });

    return output;
  }

  changeYear(year: number) {
    const date: Date = new Date(this.calendar.getDisplayedDate());
    date.setFullYear(year);

    this.calendar.setDisplayedDate(date);
  }
}
