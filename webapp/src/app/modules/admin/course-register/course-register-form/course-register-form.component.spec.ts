import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CourseRegisterFormComponent } from './course-register-form.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

describe('CourseRegisterFormComponent', () => {
  let component: CourseRegisterFormComponent;
  let fixture: ComponentFixture<CourseRegisterFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseRegisterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
