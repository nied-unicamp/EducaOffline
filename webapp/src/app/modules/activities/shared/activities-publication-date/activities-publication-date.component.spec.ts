import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivitiesPublicationDateComponent } from './activities-publication-date.component';

describe('ActivitiesPublicationDateComponent', () => {
  let component: ActivitiesPublicationDateComponent;
  let fixture: ComponentFixture<ActivitiesPublicationDateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesPublicationDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesPublicationDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
