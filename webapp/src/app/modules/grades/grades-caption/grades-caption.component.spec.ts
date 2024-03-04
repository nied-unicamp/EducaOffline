import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradesCaptionComponent } from './grades-caption.component';

describe('GradesCaptionComponent', () => {
  let component: GradesCaptionComponent;
  let fixture: ComponentFixture<GradesCaptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradesCaptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradesCaptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
