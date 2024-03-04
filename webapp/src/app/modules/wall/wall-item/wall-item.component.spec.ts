import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WallItemComponent } from './wall-item.component';

describe('WallItemComponent', () => {
  let component: WallItemComponent;
  let fixture: ComponentFixture<WallItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WallItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
