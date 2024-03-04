import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WallCommentCreateComponent } from './wall-comment-create.component';

describe('WallCommentCreateComponent', () => {
  let component: WallCommentCreateComponent;
  let fixture: ComponentFixture<WallCommentCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WallCommentCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallCommentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
