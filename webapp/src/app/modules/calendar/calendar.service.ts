import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LANGUAGE } from 'src/app/dev/languages';
import { ActivityJson } from 'src/app/models/activity.model';
import { CalendarEvent } from 'src/app/models/calendar';


@Injectable()
export class CalendarService {


  static translationText = LANGUAGE.calendar;

  eventsUrl = 'https://gist.githubusercontent.com/carlosavieira/a4bd2099a8bb9f5d7e7817a41a13574f/raw/';

  constructor(private http: HttpClient) {

  }

  getCourseEvents(courseId: number): Observable<CalendarEvent[]> {
    const url = `courses/${courseId}/activities`

    return this.http.get<ActivityJson[]>(url).pipe(
      map(activities => {
        const result: CalendarEvent[] = [] as CalendarEvent[];

        activities.forEach(item => {
          result.push(
            new CalendarEvent(
              new Date(item.publishDate),
              null,
              'A atividade \"' + item.title + '\" foi publicada',
              courseId, 1, item.id));
          result.push(
            new CalendarEvent(
              new Date(item.submissionBegin),
              null,
              'O período de submissão se inicia para: ' + item.title,
              courseId, 1, item.id));
          result.push(
            new CalendarEvent(
              new Date(item.submissionEnd),
              null,
              'O período de submissão termina para: ' + item.title,
              courseId,
              1,
              item.id));
        })


        return result
      })
    )
  }

  getEvents(): Observable<CalendarEvent[]> {
    return this.http.get(this.eventsUrl).pipe(
      map((data: any) => {
        return this.decodeEvents(data.events);
      })
    );
  }


  eventsOnDate(date: Date, events: CalendarEvent[]): CalendarEvent[] {
    const filteredEvents: CalendarEvent[] = [];

    if (events) {
      events.forEach(event => {

        if (event.endsToday(date) || event.startsToday(date)) {
          filteredEvents.push(event);
        }
      });
    }

    return filteredEvents;
  }

  decodeEvents(json: any[]): CalendarEvent[] {
    const eventsOut: CalendarEvent[] = [];

    json.forEach(event => {
      eventsOut.push(
        new CalendarEvent(
          new Date(event.startDate),
          event.endDate ? new Date(event.endDate) : null,
          event.description,
          event.courseId,
          event.toolId,
          event.itemId
        )
      );
    });

    return eventsOut;
  }

  sameDay(d0: Date, d1: Date) {
    if (!d0 || !d1) {
      return false;
    }

    return d0.getFullYear() === d1.getFullYear() && d0.getMonth() === d1.getMonth() &&
      d0.getDate() === d1.getDate();
  }
}
