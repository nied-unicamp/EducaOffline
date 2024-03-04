import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivitiesSubmissionCreateComponent } from './activities-submission-create.component';


describe('ActivitiesSubmissionCreateComponent', () => {
  let component: ActivitiesSubmissionCreateComponent;
  let fixture: ComponentFixture<ActivitiesSubmissionCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesSubmissionCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesSubmissionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
