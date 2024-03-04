import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivitiesItemComponent } from './activities-item.component';

describe('ActivitiesItemComponent', () => {
  let component: ActivitiesItemComponent;
  let fixture: ComponentFixture<ActivitiesItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
