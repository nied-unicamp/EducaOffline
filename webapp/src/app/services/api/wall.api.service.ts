import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserJson } from 'src/app/models/user.model';
import { WallCommentForm, WallCommentJson, WallReplyForm, WallReplyJson } from 'src/app/models/wall-comment.model';
import { WallPostForm, WallPostJson } from 'src/app/models/wall-post.model';

@Injectable({
  providedIn: 'root'
})
export class WallApiService {

  constructor(private http: HttpClient) { }

  getPosts(courseId: number): Observable<WallPostJson[]> {
    const url = `courses/${courseId}/posts`;

    return this.http.get<WallPostJson[]>(url).pipe(take(1));
  }

  getWallComments({ courseId, id }: { courseId: number; id: number; }): Observable<WallCommentJson[]> {
    const url = `courses/${courseId}/posts/${id}/comments`;

    return this.http.get<WallPostJson[]>(url).pipe(take(1));
  }

  fetchActivityPosts(courseId: number): Observable<any> {
    const url = `courses/${courseId}/posts/activity`;

    return this.http.get<any>(url).pipe(take(1));
  }

  createPost(form: WallPostForm, courseId: number): Observable<WallPostJson> {
    const url = `courses/${courseId}/posts`;

    return this.http.post<WallPostJson>(url, form).pipe(take(1));
  }


  createPostWithCreatedById(form: WallPostForm, userId: number, courseId: number): Observable<WallPostJson> {
    const url = `courses/${courseId}/posts/user/${userId}`;

    return this.http.post<WallPostJson>(url, form).pipe(take(1));
  }

  updatePost({ body, courseId, id }: { body: WallPostForm; courseId: number; id: number; }): Observable<WallPostJson> {
    const url = `courses/${courseId}/posts/${id}`;

    return this.http.put<WallPostJson>(url, body).pipe(take(1));
  }

  getPost({ courseId, id }: { courseId: number; id: number; }): Observable<WallPostJson> {
    const url = `courses/${courseId}/posts/${id}`;

    return this.http.get<WallPostJson>(url).pipe(take(1));
  }

  createComment({ body, courseId, postId }: { body: WallCommentForm; courseId: number; postId: number; }): Observable<WallCommentJson> {
    const url = `courses/${courseId}/posts/${postId}/comments`;

    return this.http.post<WallCommentJson>(url, body).pipe(take(1));
  }

  createReply({body, courseId, postId, commentId}: { body: WallReplyForm; courseId: number; postId: number; commentId: number;}):Observable<WallReplyJson>{
    const url = `courses/${courseId}/posts/${postId}/comments/${commentId}/comments`;

    return this.http.post<WallReplyJson>(url, body).pipe(take(1));
  }

  updateComment({ form, courseId, id, commentId }: { form: WallCommentForm; courseId: number; id: number; commentId: number; }): Observable<WallCommentJson> {
    const url = `courses/${courseId}/posts/${id}/comments/${commentId}`;

    return this.http.put<WallCommentJson>(url, form).pipe(take(1));
  }

  getComments(courseId: number, id: number): Observable<WallCommentJson[]> {
    const url = `courses/${courseId}/posts/${id}/comments`;

    return this.http.get<WallCommentJson[]>(url).pipe(take(1));
  }

  getComment(courseId: number, id: number, commentId: number): Observable<WallCommentJson> {
    const url = `courses/${courseId}/posts/${id}/comments/${commentId}`;

    return this.http.get<WallCommentJson>(url).pipe(take(1));
  }

  getReplies( {courseId, postId, commentId}: {courseId: number, postId: number, commentId: number}): Observable<WallReplyJson[]>{
    const url = `courses/${courseId}/posts/${postId}/comments/${commentId}/comments`;

    return this.http.get<WallReplyJson[]>(url).pipe(take(1));
  }

  getReply(courseId: number, id: number, commentId: number, replyId: number): Observable<WallCommentJson>{
    const url = `courses/${courseId}/posts/${id}/comments/${commentId}/comments/${replyId}`;
    
    return this.http.get<WallReplyJson>(url).pipe(take(1));
  }
  deleteComment({ courseId, postId, commentId }: { courseId: number; postId: number; commentId: number; }): Observable<any> {
    const url = `courses/${courseId}/posts/${postId}/comments/${commentId}`;

    return this.http.delete<any>(url);
  }

  deletePost({ courseId, id }: { courseId: number; id: number; }): Observable<any> {
    const url = `courses/${courseId}/posts/${id}`;

    return this.http.delete<any>(url);
  }

  deleteReply({ courseId, postId, replyId }: { courseId: number; postId: number; replyId: number;}): Observable<any> {
    const url = `courses/${courseId}/posts/${postId}/comments/${replyId}`;

    return this.http.delete<any>(url);
  }

  pinPost({ courseId, id }: { courseId: number; id: number; }): Observable<WallPostJson> {
    const url = `courses/${courseId}/posts/${id}/pin`;

    return this.http.post<any>(url, {});
  }

  unpinPost({ courseId, id }: { courseId: number; id: number; }): Observable<WallPostJson> {
    const url = `courses/${courseId}/posts/${id}/unpin`;

    return this.http.post<any>(url, {});
  }

  changeLike({ to, courseId, id }: { to: boolean; courseId: number; id: number; }) {
    return to ? this.likePost({ courseId, id }) : this.removeLikeFromPost({ courseId, id });
  }

  changeCommentLike({ to, courseId, postId, commentId }: { to: boolean; courseId: number; postId: number; commentId: number; }) {
    return to ? this.likeComment({ courseId, postId, commentId }) : this.removeLikeFromComment({ courseId, postId, commentId });
  }

  changePin({ to, courseId, id }: { to: boolean; courseId: number; id: number; }) {
    return to ? this.pinPost({ courseId, id }) : this.unpinPost({ courseId, id });
  }

  changeFavorite({ to, courseId, id }: { to: boolean; courseId: number; id: number; }) {
    return to ? this.favoritePost({ courseId, id }) : this.unfavoritePost({ courseId, id });
  }

  likePost({ courseId, id }: { courseId: number; id: number; }): Observable<void> {
    const url = `courses/${courseId}/posts/${id}/like`;

    return this.http.post<any>(url, {});
  }

  removeLikeFromPost({ courseId, id }: { courseId: number; id: number; }): Observable<void> {
    const url = `courses/${courseId}/posts/${id}/dislike`;

    return this.http.post<any>(url, {});
  }

  removeLikeFromComment({ courseId, commentId, postId }: { courseId: number; commentId: number; postId: number; }): Observable<void> {
    const url = `courses/${courseId}/posts/${postId}/comments/${commentId}/dislike`;

    return this.http.post<any>(url, {});
  }

  favoritePost({ courseId, id }: { courseId: number; id: number; }): Observable<void> {
    const url = `courses/${courseId}/posts/${id}/favorite`;

    return this.http.post<any>(url, {});
  }

  unfavoritePost({ courseId, id }: { courseId: number; id: number; }): Observable<void> {
    const url = `courses/${courseId}/posts/${id}/unfavorite`;

    return this.http.post<any>(url, {});
  }

  getLikes({ courseId, id }: { courseId: number; id: number; }): Observable<UserJson[]> {
    const url = `courses/${courseId}/posts/${id}/likes`;

    return this.http.get<UserJson[]>(url).pipe(take(1));
  }

  getFavoritePosts(courseId: number): Observable<WallPostJson[]> {
    const url = `courses/${courseId}/posts/favorites`;

    return this.http.get<WallPostJson[]>(url).pipe(take(1));
  }

  likeComment({ courseId, postId, commentId }: { courseId: number; postId: number; commentId: number; }): Observable<void> {
    const url = `courses/${courseId}/posts/${postId}/comments/${commentId}/like`;

    return this.http.post<any>(url, {});
  }

  getCommentLikes({ courseId, postId, commentId }: { courseId: number; postId: number; commentId: number; }): Observable<UserJson[]> {
    const url = `courses/${courseId}/posts/${postId}/comments/${commentId}/likes`;

    return this.http.get<UserJson[]>(url).pipe(take(1));
  }


}
