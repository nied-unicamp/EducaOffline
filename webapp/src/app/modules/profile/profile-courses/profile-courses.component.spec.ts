import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileCoursesComponent } from './profile-courses.component';

describe('ProfileCoursesComponent', () => {
  let component: ProfileCoursesComponent;
  let fixture: ComponentFixture<ProfileCoursesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
