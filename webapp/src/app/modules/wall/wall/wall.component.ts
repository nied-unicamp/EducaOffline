import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WallPost } from 'src/app/models/wall-post.model';
import { CourseActions } from 'src/app/state/course/course.actions';
import { CourseSelectors } from 'src/app/state/course/course.selector';
import { WallPostActions } from 'src/app/state/wall-post/wall-post.actions';
import { WallPostAdvancedSelectors } from 'src/app/state/wall-post/wall-post.advanced.selector';
import { WallPostSelectors } from 'src/app/state/wall-post/wall-post.selector';


@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.css']
})
export class WallComponent implements OnInit {
  posts: Observable<WallPost[]>;
  courseId: number;

  constructor(
    private store: Store,
  ) { }

  ngOnInit() {
    this.store.select(CourseSelectors.currentId).pipe(
      map((id) => this.courseId = id)
    ).subscribe();
    this.store.dispatch(WallPostActions.api.byCourse.id.fetchActivityPosts.request({ input: { courseId: this.courseId } }))
    this.fetchPosts();

    this.posts = this.store.select(WallPostAdvancedSelectors.sel.many(WallPostSelectors.byCourse.current.all)).pipe(
      map(posts => posts.sort(this.sortWallPosts))
    )
  }

  fetchPosts() {
    this.store.dispatch(WallPostActions.api.byCourse.current.get.all.request())
  }

  private sortWallPosts(a: WallPost, b: WallPost) {
    const dateA = a?.lastModifiedDate;
    const dateB = b?.lastModifiedDate;

    if (a?.isFixed !== b?.isFixed) {
      return a?.isFixed ? -1 : 1;
    }

    return dateA > dateB ? -1 : (dateA < dateB ? 1 : 0);
  }

  trackPost(index: number, post: WallPost) {
    return post?.id;
  }
}
