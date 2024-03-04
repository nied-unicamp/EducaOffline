import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivitiesSortComponent } from './activities-sort.component';

describe('ActivitiesSortComponent', () => {
  let component: ActivitiesSortComponent;
  let fixture: ComponentFixture<ActivitiesSortComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
