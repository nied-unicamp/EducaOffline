import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivitiesFilterComponent } from './activities-filter.component';

describe('ActivitiesFilterComponent', () => {
  let component: ActivitiesFilterComponent;
  let fixture: ComponentFixture<ActivitiesFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
