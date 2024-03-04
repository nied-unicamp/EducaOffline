import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivitiesListStudentsComponent } from './activities-list-students.component';


describe('ActivitiesListStudentsComponent', () => {
  let component: ActivitiesListStudentsComponent;
  let fixture: ComponentFixture<ActivitiesListStudentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActivitiesListStudentsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesListStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
