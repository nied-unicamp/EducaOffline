package br.niedunicamp.controller;

import java.util.List;

import javax.validation.Valid;

//#region Imports
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
import br.niedunicamp.model.Course;
import br.niedunicamp.model.Post;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.PostDTO;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.PostService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;
//#endregion

@CrossOrigin
@Api(value = "PostController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequestMapping("/v1/courses/{courseId}/posts")
public class PostController {

    // #region Repositories
    @Autowired
    private PostService postService;

    @Autowired
    private CoreService coreService;
    // #endregion

    @GetMapping
    @ApiOperation("List posts")
    public ResponseEntity<?> list(@PathVariable Long courseId, @AuthenticationPrincipal UserDetails userDetails) {

        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("list_posts", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        boolean canListAll = coreService.hasPermission("list_all_activities", courseId, userDetails);
        boolean canListPublished = coreService.hasPermission("list_published_activities", courseId, userDetails);

        return postService.list(course, userDetails, canListAll || canListPublished, canListPublished && !canListAll);
    }

    @GetMapping("activity")
    @ApiOperation("List posts")
    public ResponseEntity<?> listActivityPosts(@PathVariable Long courseId, @AuthenticationPrincipal UserDetails userDetails) {

        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("list_posts", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return postService.listActivityPosts(course);
    }

    @GetMapping("{postId}")
    @ApiOperation("Get post")
    public ResponseEntity<?> get(@PathVariable Long courseId, @PathVariable Long postId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Post post = coreService.validatePost(courseId, postId);

        if (!coreService.hasPermission("list_posts", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return postService.get(post, userDetails);
    }

    @PostMapping("{postId}/pin")
    @ApiOperation("Pin post")
    public ResponseEntity<?> pin(@PathVariable Long courseId, @PathVariable Long postId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Post post = coreService.validatePost(courseId, postId);

        if (!coreService.hasPermission("update_post", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return postService.pin(post, userDetails);
    }

    @PostMapping("{postId}/unpin")
    @ApiOperation("Unpin post")
    public ResponseEntity<?> unpin(@PathVariable Long courseId, @PathVariable Long postId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Post post = coreService.validatePost(courseId, postId);

        if (!coreService.hasPermission("update_post", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return postService.unpin(post, userDetails);
    }

    @PostMapping
    @ApiOperation("Create post")
    public ResponseEntity<?> create(@RequestBody @Valid PostDTO postDTO, @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long courseId) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("create_post", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return postService.create(postDTO, course, userDetails);
    }


    @PostMapping("user/{userId}")
    @ApiOperation("Create post")
    public ResponseEntity<?> createWithCreatedById(@PathVariable Long userId, @RequestBody @Valid PostDTO postDTO, @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long courseId) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("create_post", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return postService.createWithCreatedById(userId, postDTO, course, userDetails);
    }

    @DeleteMapping("{postId}")
    @ApiOperation("Delete post")
    public ResponseEntity<?> delete(@PathVariable Long postId, @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long courseId) {
        Post post = coreService.validatePost(courseId, postId);

        if (!coreService.hasPermission("delete_post", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return postService.delete(post);
    }

    @PutMapping("{postId}")
    @ApiOperation("Create post")
    public ResponseEntity<?> update(@PathVariable Long postId, @RequestBody PostDTO postDTO,
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long courseId) {

        Post post = coreService.validatePost(courseId, postId);

        if (!coreService.hasPermission("update_post", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return postService.update(postDTO, post, userDetails);
    }

    @PostMapping("{postId}/like")
    @ApiOperation("Like post")
    public ResponseEntity<?> like(@PathVariable Long courseId, @PathVariable Long postId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        if (!coreService.hasPermission("list_posts", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized to view posts.");
        }

        Post post = coreService.validatePost(courseId, postId);

        // if (!coreService.hasPermission("like_posts", courseId, userDetails)) {
        // throw new UserNotAuthorized("User not authorized to like posts");
        // }

        return postService.like(post, userDetails);
    }

    @PostMapping("{postId}/dislike")
    @ApiOperation("Like post")
    public ResponseEntity<?> dislike(@PathVariable Long courseId, @PathVariable Long postId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        if (!coreService.hasPermission("list_posts", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized to view posts.");
        }

        Post post = coreService.validatePost(courseId, postId);

        // if (!coreService.hasPermission("like_posts", courseId, userDetails)) {
        // throw new UserNotAuthorized("User not authorized to like posts");
        // }

        return postService.dislike(post, userDetails);
    }

    @PostMapping("{postId}/favorite")
    @ApiOperation("Add post to favorites")
    public ResponseEntity<?> favorite(@PathVariable Long courseId, @PathVariable Long postId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        if (!coreService.hasPermission("list_posts", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized to view posts.");
        }

        Post post = coreService.validatePost(courseId, postId);

        return postService.favorite(post, userDetails);
    }

    @GetMapping("favorites")
    @ApiOperation("Get list of favorite posts")
    public ResponseEntity<List<Post>> listFavorites(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("list_posts", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized to view posts.");
        }

        return postService.listFavorite(course, userDetails);
    }

    @PostMapping("{postId}/unfavorite")
    @ApiOperation("Remove post from favorites")
    public ResponseEntity<?> unfavorite(@PathVariable Long courseId, @PathVariable Long postId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        if (!coreService.hasPermission("list_posts", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized to view posts.");
        }

        Post post = coreService.validatePost(courseId, postId);

        return postService.unfavorite(post, userDetails);
    }

    @GetMapping("{postId}/likes")
    @ApiOperation("Get list of user that liked this post")
    public ResponseEntity<List<User>> listLikes(@PathVariable Long courseId, @PathVariable Long postId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        if (!coreService.hasPermission("list_posts", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized to view posts.");
        }

        Post post = coreService.validatePost(courseId, postId);

        return postService.listLikes(post);
    }
}