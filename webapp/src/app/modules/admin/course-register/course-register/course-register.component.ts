import { Component } from '@angular/core';
import { CourseRegisterService } from './../course-register.service';

@Component({
  selector: 'app-course-register',
  templateUrl: './course-register.component.html',
  styleUrls: ['./course-register.component.css']
})
export class CourseRegisterComponent {

  response: any;
  showResponse: boolean;
  translationText = CourseRegisterService.translationText.CourseRegisterComponent;

  constructor(private courseRegisterService: CourseRegisterService) {
    this.response = null;
    this.showResponse = false;
  }



  setResponse(response: any) {
    this.response = response;
    this.showResponse = true;
  }

}
