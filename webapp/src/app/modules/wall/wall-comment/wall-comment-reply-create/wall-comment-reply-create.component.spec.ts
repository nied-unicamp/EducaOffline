import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallCommentReplyCreateComponent } from './wall-comment-reply-create.component';

describe('WallCommentReplyCreateComponent', () => {
  let component: WallCommentReplyCreateComponent;
  let fixture: ComponentFixture<WallCommentReplyCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WallCommentReplyCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WallCommentReplyCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
