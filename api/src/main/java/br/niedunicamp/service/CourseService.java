package br.niedunicamp.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import br.niedunicamp.model.Course;
import br.niedunicamp.pojo.CourseDTO;
import br.niedunicamp.pojo.CourseKey;

public interface CourseService {

    ResponseEntity<Course> create(CourseDTO courseDTO, UserDetails userDetails);

    ResponseEntity<?> delete(Course course);

    ResponseEntity<Course> update(Course course, CourseDTO courseDTO);

    ResponseEntity<List<Course>> listCourses();

    ResponseEntity<Course> findByKey(String key);

    ResponseEntity<Course> findOpenCourseByKey(String key);

    ResponseEntity<CourseKey> setKey(Course course, String key);

    ResponseEntity<CourseKey> getKey(Course course);

    ResponseEntity<CourseKey> refreshKey(Course course);

    // ResponseEntity<Course> findByCourseProfessor(String prof);

    ResponseEntity<List<Course>> listActiveCourses();

    ResponseEntity<List<Course>> listEndedCourses();

    ResponseEntity<List<Course>> listOpenSubscriptions();

    ResponseEntity<List<Course>> findByCourseName(String name);

    ResponseEntity<Course> get(Course course);

}