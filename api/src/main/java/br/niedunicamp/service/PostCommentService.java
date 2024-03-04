package br.niedunicamp.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import br.niedunicamp.model.Post;
import br.niedunicamp.model.PostComment;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.PostCommentDTO;

public interface PostCommentService {
    ResponseEntity<PostComment> create(PostCommentDTO postComment, Post post, UserDetails userDetails);

    ResponseEntity<PostComment> create(PostCommentDTO postComment, PostComment parentComment, UserDetails userDetails);

    ResponseEntity<?> delete(PostComment postComment);

    ResponseEntity<PostComment> update(PostCommentDTO postCommentDTO, PostComment postComment, UserDetails userDetails);

    ResponseEntity<List<PostComment>> list(Post post, UserDetails userDetails);

    ResponseEntity<List<PostComment>> list(PostComment comment, UserDetails userDetails);

    ResponseEntity<?> like(PostComment postComment, UserDetails userDetails);

    ResponseEntity<List<User>> listLikes(PostComment postComment);

    ResponseEntity<?> dislike(PostComment postComment, UserDetails userDetails);
}