package br.niedunicamp.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import br.niedunicamp.model.Activity;
import br.niedunicamp.model.Course;

@Repository
public interface ActivityRepository extends PagingAndSortingRepository<Activity, Long> {

    Activity findBySubmissionBegin(Date begin);

    Activity findBySubmissionEnd(Date end);

    // Activity findById(Long id);

    List<Activity> findByCourse(Course course);

    List<Activity> findByCourseAndGradeWeightGreaterThan(Course course, Float minWeight);

    List<Activity> findByCourseAndGradeWeight(Course course, Float gradeWeight);

    List<Activity> findByCourseAndPublishDateLessThan(Course course, Date publishDate);

}
