import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivitiesCreateComponent } from './activities-create.component';

describe('ActivitiesCreateComponent', () => {
  let component: ActivitiesCreateComponent;
  let fixture: ComponentFixture<ActivitiesCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
