import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublicationDateComponent } from './publication-date.component';

describe('PublicationDateComponent', () => {
  let component: PublicationDateComponent;
  let fixture: ComponentFixture<PublicationDateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicationDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
