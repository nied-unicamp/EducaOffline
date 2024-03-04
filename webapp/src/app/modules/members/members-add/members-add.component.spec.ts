import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MembersAddComponent } from './members-add.component';

describe('MembersAddComponent', () => {
  let component: MembersAddComponent;
  let fixture: ComponentFixture<MembersAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MembersAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
