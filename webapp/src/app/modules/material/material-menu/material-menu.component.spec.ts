import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaterialMenuComponent } from './material-menu.component';

describe('MaterialMenuComponent', () => {
  let component: MaterialMenuComponent;
  let fixture: ComponentFixture<MaterialMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
