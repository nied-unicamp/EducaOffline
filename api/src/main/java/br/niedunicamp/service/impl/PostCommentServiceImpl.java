package br.niedunicamp.service.impl;

//#region Imports
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.niedunicamp.model.Post;
import br.niedunicamp.model.PostComment;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.PostCommentDTO;
import br.niedunicamp.repository.ParticipationRepository;
import br.niedunicamp.repository.PostCommentRepository;
import br.niedunicamp.repository.PostRepository;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.NotificationService;
import br.niedunicamp.service.PostCommentService;
//#endregion

@Service
public class PostCommentServiceImpl implements PostCommentService {

    // #region Repositories and Services
    @Autowired
    PostCommentRepository commentRepository;

    @Autowired
    PostRepository postRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ParticipationRepository participationRepository;

    @Autowired
    CoreService coreService;

    @Autowired
    NotificationService notificationService;
    // #endregion

    @Override
    public ResponseEntity<PostComment> create(PostCommentDTO postCommentDTO, Post post, UserDetails userDetails) {

        PostComment comment = new PostComment();

        comment.setText(postCommentDTO.getText());
        comment.setPost(post);
        comment.setParentComment(null);

        return create(comment, userDetails);
    }

    @Override
    public ResponseEntity<PostComment> create(PostCommentDTO postCommentDTO, PostComment parentComment,
            UserDetails userDetails) {

        PostComment comment = new PostComment();

        comment.setText(postCommentDTO.getText());
        comment.setParentComment(parentComment);
        comment.setPost(parentComment.getPost());

        return create(comment, userDetails);
    }

    private ResponseEntity<PostComment> create(PostComment comment, UserDetails userDetails) {
        coreService.addCreated(comment, userDetails);
        coreService.updateLastModified(comment, userDetails);

        comment = commentRepository.save(comment);
        comment = addLikesAndIsTeacherFor(comment, userDetails);

        User user = userRepository.findByEmail(userDetails.getUsername());
        Boolean isTeacher = user.getIsAdmin() || participationRepository
                .findByUserAndCourse(user, comment.getPost().getCourse()).getRole().getName() == "TEACHER";

        if (isTeacher) {
            notificationService.addPostCommentByTeacher(comment.getPost());
        } else {
            notificationService.upsertNewPostComments(comment.getPost());
        }

        return ResponseEntity.ok(comment);
    }

    @Override
    public ResponseEntity<?> delete(PostComment postComment) {

        commentRepository.delete(postComment);
        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<PostComment> update(PostCommentDTO postCommentDTO, PostComment comment,
            UserDetails userDetails) {

        comment.setText(postCommentDTO.getText());
        coreService.updateLastModified(comment, userDetails);

        return ResponseEntity.ok(addLikesAndIsTeacherFor(commentRepository.save(comment), userDetails));
    }

    @Override
    public ResponseEntity<List<PostComment>> list(Post post, UserDetails userDetails) {

        return ResponseEntity
                .ok(addLikesAndIsTeacherFor(commentRepository.findByPostAndParentCommentIsNull(post), userDetails));
    }

    @Override
    public ResponseEntity<List<PostComment>> list(PostComment comment, UserDetails userDetails) {

        return ResponseEntity.ok(addLikesAndIsTeacherFor(commentRepository.findByParentComment(comment), userDetails));
    }

    @Override
    public ResponseEntity<?> like(PostComment postComment, UserDetails userDetails) {
        User user = coreService.validateUser(userDetails);

        Set<User> likes = postComment.getLikedBy();

        if (!likes.contains(user)) {
            likes.add(user);
            postComment.setLikedBy(likes);

            commentRepository.save(postComment);
        }

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<?> dislike(PostComment postComment, UserDetails userDetails) {
        User user = coreService.validateUser(userDetails);

        Set<User> likes = postComment.getLikedBy();

        if (likes.contains(user)) {
            likes.remove(user);
            postComment.setLikedBy(likes);

            commentRepository.save(postComment);
        }

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<List<User>> listLikes(PostComment postComment) {
        return ResponseEntity.ok(postComment.getLikedBy().stream().collect(Collectors.toList()));
    }

    private List<PostComment> addLikesAndIsTeacherFor(List<PostComment> postComments, UserDetails userDetails) {
        User user = coreService.validateUser(userDetails);

        return postComments.stream().map(postComment -> {
            postComment.setLiked(postComment.getLikedBy().contains(user));
            postComment.setLikeCounter(postComment.getLikedBy().size());

            boolean canDeleteAnyPost = coreService.hasPermission("delete_post", postComment.getPost().getCourse(),
                    postComment.getCreatedBy());

            postComment.setTeacher(canDeleteAnyPost);

            return postComment;
        }).collect(Collectors.toList());
    }

    private PostComment addLikesAndIsTeacherFor(PostComment postComment, UserDetails userDetails) {
        User user = coreService.validateUser(userDetails);

        postComment.setLiked(postComment.getLikedBy().contains(user));
        postComment.setLikeCounter(postComment.getLikedBy().size());

        boolean canDeleteAnyPost = coreService.hasPermission("delete_post", postComment.getPost().getCourse(),
                postComment.getCreatedBy());

        postComment.setTeacher(canDeleteAnyPost);

        return postComment;
    }
}