import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminListCoursesComponent } from './admin-list-courses.component';

describe('AdminListCoursesComponent', () => {
  let component: AdminListCoursesComponent;
  let fixture: ComponentFixture<AdminListCoursesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
