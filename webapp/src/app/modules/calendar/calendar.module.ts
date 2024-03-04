import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarService } from './calendar.service';
import { CalendarComponent } from './calendar/calendar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    NgbModule,
    CalendarRoutingModule
  ],
  declarations: [
    CalendarComponent
  ],
  exports: [CalendarComponent],
  providers: [CalendarService]
})
export class CalendarModule { }
