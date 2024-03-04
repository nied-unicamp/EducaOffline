import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivitiesMenuComponent } from './activities-menu.component';

describe('ActivitiesMenuComponent', () => {
  let component: ActivitiesMenuComponent;
  let fixture: ComponentFixture<ActivitiesMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
