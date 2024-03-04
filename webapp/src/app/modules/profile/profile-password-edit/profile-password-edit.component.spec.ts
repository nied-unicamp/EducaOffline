import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfilePasswordEditComponent } from './profile-password-edit.component';

describe('ProfilePasswordEditComponent', () => {
  let component: ProfilePasswordEditComponent;
  let fixture: ComponentFixture<ProfilePasswordEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePasswordEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePasswordEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
