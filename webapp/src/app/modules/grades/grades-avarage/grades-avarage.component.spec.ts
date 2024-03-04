import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradesAvarageComponent } from './grades-avarage.component';

describe('GradesAvarageComponent', () => {
  let component: GradesAvarageComponent;
  let fixture: ComponentFixture<GradesAvarageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradesAvarageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradesAvarageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
