import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WallCreateComponent } from './wall-create.component';

describe('WallCreateComponent', () => {
  let component: WallCreateComponent;
  let fixture: ComponentFixture<WallCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WallCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
