import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GradesEditWeightComponent } from './grades-edit-weight.component';

describe('GradesEditWeightComponent', () => {
  let component: GradesEditWeightComponent;
  let fixture: ComponentFixture<GradesEditWeightComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GradesEditWeightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradesEditWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
