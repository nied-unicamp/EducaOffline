package br.niedunicamp.controller;

//#region Imports
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Post;
import br.niedunicamp.model.PostComment;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.PostCommentDTO;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.PostCommentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;
//#endregion

@CrossOrigin
@Api(value = "PostCommentController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequestMapping("/v1/courses/{courseId}/posts/{postId}/comments")
public class PostCommentController {

    //#region Repositories
    @Autowired
    private PostCommentService commentService;

    @Autowired
    private CoreService coreService;
    //#endregion

    @GetMapping
    @ApiOperation("List comments")
    public ResponseEntity<List<PostComment>> list(@PathVariable Long postId, @PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Post post = coreService.validatePost(courseId, postId);

        if (!coreService.hasPermission("list_post_comments", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }

        return commentService.list(post, userDetails);
    }

    @PostMapping
    @ApiOperation("Create comment")
    public ResponseEntity<PostComment> create(@RequestBody PostCommentDTO comment,
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long postId, @PathVariable Long courseId) {
        Post post = coreService.validatePost(courseId, postId);

        if (!coreService.hasPermission("create_comment", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return commentService.create(comment, post, userDetails);
    }

    @PostMapping("{commentId}/comments")
    @ApiOperation("Create comment of a comment")
    public ResponseEntity<PostComment> create(@RequestBody PostCommentDTO commentDTO,
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long postId, @PathVariable Long courseId,
            @PathVariable Long commentId) {

        PostComment comment = coreService.validateComment(courseId, postId, commentId);

        if (!coreService.hasPermission("create_comment", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        if (comment.getParentComment() instanceof PostComment) {
            throw new UserNotAuthorized(
                    "You cannot create comment a 3rd level comment. (comment of comment of comment)");
        }

        return commentService.create(commentDTO, comment, userDetails);
    }

    @GetMapping("{commentId}/comments")
    @ApiOperation("View comments of this comment")
    public ResponseEntity<List<PostComment>> listChildComments(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long postId, @PathVariable Long courseId,
            @PathVariable Long commentId) {

        PostComment comment = coreService.validateComment(courseId, postId, commentId);

        if (!coreService.hasPermission("list_post_comments", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }

        return commentService.list(comment, userDetails);
    }

    @DeleteMapping("{commentId}")
    @ApiOperation("Delete comment")
    public ResponseEntity<?> delete(@PathVariable Long commentId, @PathVariable Long postId,
            @PathVariable Long courseId, @AuthenticationPrincipal UserDetails userDetails) {

        PostComment comment = coreService.validateComment(courseId, postId, commentId);

        if (!coreService.hasPermission("delete_post_comment", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return commentService.delete(comment);
    }

    @PutMapping("{commentId}")
    @ApiOperation("Edit comment")
    public ResponseEntity<PostComment> update(@PathVariable Long postId, @PathVariable Long courseId,
            @RequestBody PostCommentDTO commentDTO, @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long commentId) {

        PostComment comment = coreService.validateComment(courseId, postId, commentId);

        if (!coreService.hasPermission("update_post_comment", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return commentService.update(commentDTO, comment, userDetails);
    }

    @PostMapping("{commentId}/like")
    @ApiOperation("Like comment")
    public ResponseEntity<?> like(@PathVariable Long courseId, @PathVariable Long postId, @PathVariable Long commentId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        if (!coreService.hasPermission("list_posts", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized to view posts.");
        }

        PostComment postComment = coreService.validateComment(courseId, postId, commentId);

        return commentService.like(postComment, userDetails);
    }

    @PostMapping("{commentId}/dislike")
    @ApiOperation("Dislike comment")
    public ResponseEntity<?> dislike(@PathVariable Long courseId, @PathVariable Long postId, @PathVariable Long commentId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        if (!coreService.hasPermission("list_posts", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized to view posts.");
        }

        PostComment postComment = coreService.validateComment(courseId, postId, commentId);

        return commentService.dislike(postComment, userDetails);
    }

    @GetMapping("{commentId}/likes")
    @ApiOperation("Get list of user that liked this post")
    public ResponseEntity<List<User>> listLikes(@PathVariable Long courseId, @PathVariable Long postId, @PathVariable Long commentId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        if (!coreService.hasPermission("list_posts", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized to view posts.");
        }

        PostComment postComment = coreService.validateComment(courseId, postId, commentId);

        return commentService.listLikes(postComment);
    }
}