import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GradesPersonalComponent } from './grades-personal.component';

describe('GradesPersonalComponent', () => {
  let component: GradesPersonalComponent;
  let fixture: ComponentFixture<GradesPersonalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GradesPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradesPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
