import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivityShareComponent } from './activity-share.component';

describe('ActivityShareComponent', () => {
  let component: ActivityShareComponent;
  let fixture: ComponentFixture<ActivityShareComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
