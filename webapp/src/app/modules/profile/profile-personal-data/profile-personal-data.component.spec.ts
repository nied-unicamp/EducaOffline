import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfilePersonalDataComponent } from './profile-personal-data.component';

describe('ProfilePersonalDataComponent', () => {
  let component: ProfilePersonalDataComponent;
  let fixture: ComponentFixture<ProfilePersonalDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePersonalDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
