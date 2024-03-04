import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivitiesFeedbackComponent } from './activities-feedback.component';

describe('ActivitiesFeedbackComponent', () => {
  let component: ActivitiesFeedbackComponent;
  let fixture: ComponentFixture<ActivitiesFeedbackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
