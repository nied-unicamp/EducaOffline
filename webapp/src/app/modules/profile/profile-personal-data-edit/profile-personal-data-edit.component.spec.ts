import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfilePersonalDataEditComponent } from './profile-personal-data-edit.component';

describe('ProfilePersonalDataEditComponent', () => {
  let component: ProfilePersonalDataEditComponent;
  let fixture: ComponentFixture<ProfilePersonalDataEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePersonalDataEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePersonalDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
