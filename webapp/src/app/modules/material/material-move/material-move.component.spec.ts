import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialMoveComponent } from './material-move.component';

describe('MaterialMoveComponent', () => {
  let component: MaterialMoveComponent;
  let fixture: ComponentFixture<MaterialMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialMoveComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
