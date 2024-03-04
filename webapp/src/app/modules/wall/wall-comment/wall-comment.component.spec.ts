import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WallCommentComponent } from './wall-comment.component';

describe('WallCommentComponent', () => {
  let component: WallCommentComponent;
  let fixture: ComponentFixture<WallCommentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WallCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
