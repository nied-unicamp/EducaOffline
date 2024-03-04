package br.niedunicamp.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.niedunicamp.model.Activity;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.Material;
import br.niedunicamp.model.Notification;
import br.niedunicamp.model.Post;
import br.niedunicamp.model.User;

@Service
public interface NotificationService {
    ResponseEntity<List<Notification>> listForUserAndCourse(User user, Course course);

    ResponseEntity<List<Notification>> listForUser(User user);

    Notification upsertNewStudent(Course course, User user);

    Notification upsertNewMaterial(Material material);

    Notification addActivityPublished(Activity activity);

    Notification addActivityGradeReleased(Activity activity);

    Notification addWallPostByTeacher(Post post);

    Notification upsertNewWallPost(Post post);

    Notification addPostCommentByTeacher(Post post);

    Notification upsertNewPostComments(Post post);

    Notification upsertNewPostLikes(Post post);

    Notification removeLikeOnNewPostLikes(Post post);

    Notification updateActivityPublished(Activity activity);
}