import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GradesCourseComponent } from './grades-course.component';

describe('GradesCourseComponent', () => {
  let component: GradesCourseComponent;
  let fixture: ComponentFixture<GradesCourseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GradesCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradesCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
