import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncStatusIconComponent } from './sync-status-icon.component';

describe('SyncStatusIconComponent', () => {
  let component: SyncStatusIconComponent;
  let fixture: ComponentFixture<SyncStatusIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyncStatusIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncStatusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
