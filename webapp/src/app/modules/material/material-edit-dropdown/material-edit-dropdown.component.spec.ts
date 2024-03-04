import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEditDropdownComponent } from './material-edit-dropdown.component';

describe('MaterialEditDropdownComponent', () => {
  let component: MaterialEditDropdownComponent;
  let fixture: ComponentFixture<MaterialEditDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialEditDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialEditDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
