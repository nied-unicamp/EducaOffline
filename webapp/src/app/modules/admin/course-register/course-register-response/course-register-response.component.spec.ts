import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourseRegisterResponseComponent } from './course-register-response.component';

describe('CourseRegisteredComponent', () => {
  let component: CourseRegisterResponseComponent;
  let fixture: ComponentFixture<CourseRegisterResponseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseRegisterResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseRegisterResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
