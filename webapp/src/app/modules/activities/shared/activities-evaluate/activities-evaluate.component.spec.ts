import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivitiesEvaluateComponent } from './activities-evaluate.component';

describe('ActivitiesEvaluateComponent', () => {
  let component: ActivitiesEvaluateComponent;
  let fixture: ComponentFixture<ActivitiesEvaluateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesEvaluateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesEvaluateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
