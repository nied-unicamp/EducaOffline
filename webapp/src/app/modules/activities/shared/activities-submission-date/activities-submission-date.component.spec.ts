import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivitiesSubmissionDateComponent } from './activities-submission-date.component';


describe('ActivitiesSubmissionDateComponent', () => {
  let component: ActivitiesSubmissionDateComponent;
  let fixture: ComponentFixture<ActivitiesSubmissionDateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActivitiesSubmissionDateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesSubmissionDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
