package br.niedunicamp.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.Participation;
import br.niedunicamp.model.Role;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.RolesAndCourses;

public interface ParticipationService {
    ResponseEntity<Participation> create(User user, Course course, Role role);

    ResponseEntity<List<Participation>> listParticipations();

    ResponseEntity<RolesAndCourses> listUserCoursesAndRoles(User user);

    ResponseEntity<List<Participation>> findByUser(User user);

    ResponseEntity<List<Course>> findCoursesByUser(User user);

    ResponseEntity<List<Course>> findActiveCoursesByUser(User user);

    ResponseEntity<List<Course>> findInactiveCoursesByUser(User user);

    ResponseEntity<List<Participation>> findByCourse(Course course);

    ResponseEntity<Role> findByUserAndCourse(User user, Course course);

    ResponseEntity<List<User>> findByCourseAndRole(Course course, Role role);

    ResponseEntity<List<Course>> findByUserAndRole(User user, Role role);

    ResponseEntity<Participation> enrollByKey(String courseKey, UserDetails userDetails);

    ResponseEntity<?> delete(User user, Course course);
}