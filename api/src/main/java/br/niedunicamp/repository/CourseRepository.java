package br.niedunicamp.repository;

import br.niedunicamp.model.Course;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends PagingAndSortingRepository<Course, Long> {
    
    // Course findById(Long id);
    
    Optional<Course> findByKey(String key);
    
    List<Course> findByNameContaining(String name);

    List<Course> findByStartDateGreaterThan(Date begin);

    List<Course> findByStartDateGreaterThanAndEndDateGreaterThan(Date begin, Date end);

    List<Course> findBySubscriptionBeginLessThanAndSubscriptionEndGreaterThan(Date begin, Date end);

    List<Course> findByEndDateLessThan(Date date);
}
