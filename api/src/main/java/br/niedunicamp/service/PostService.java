package br.niedunicamp.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import br.niedunicamp.model.Activity;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.Post;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.PostDTO;

public interface PostService {
    ResponseEntity<Post> create(PostDTO post, Course course, UserDetails userDetails);

    ResponseEntity<Post> createWithActivityId(PostDTO post, Course course, Long activityId, UserDetails userDetails);

    Post createWithActivity(Activity activity);

    ResponseEntity<Post> createWithCreatedById(Long userId, PostDTO postDTO, Course course, UserDetails userDetails);

    ResponseEntity<?> delete(Post post);

    ResponseEntity<Post> update(PostDTO postDTO, Post post, UserDetails userDetails);

    ResponseEntity<List<Post>> list(Course course, UserDetails userDetails, boolean activities, boolean onlyPublishedActivities);

    ResponseEntity<?> listActivityPosts(Course course);

    ResponseEntity<Post> get(Post post, UserDetails userDetails);

    ResponseEntity<?> like(Post post, UserDetails userDetails);

    ResponseEntity<List<User>> listLikes(Post post);

    ResponseEntity<?> dislike(Post post, UserDetails userDetails);

    ResponseEntity<?> favorite(Post post, UserDetails userDetails);

    ResponseEntity<?> unfavorite(Post post, UserDetails userDetails);

    ResponseEntity<List<Post>> listFavorite(Course course, UserDetails userDetails);


    ResponseEntity<?> pin(Post post, UserDetails userDetails);

    ResponseEntity<?> unpin(Post post, UserDetails userDetails);
}