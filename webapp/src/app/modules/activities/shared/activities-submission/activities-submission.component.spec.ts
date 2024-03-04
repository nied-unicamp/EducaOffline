import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivitiesSubmissionComponent } from './activities-submission.component';


describe('ActivitiesSubmissionCreateComponent', () => {
  let component: ActivitiesSubmissionComponent;
  let fixture: ComponentFixture<ActivitiesSubmissionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
