package br.niedunicamp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.niedunicamp.model.Activity;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.Post;
import br.niedunicamp.model.User;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByCreatedBy(User createdBy);

    List<Post> findByCourseAndCreatedBy(Course course, User user);

    List<Post> findByCourse(Course course);

    List<Post> findByCourseAndActivityIsNull(Course course);

    List<Post> findByCourseAndActivityIsNotNull(Course course);

    List<Post> findByCourseAndIsFixedTrue(Course course);

    Post findByActivity(Activity activity);
}
