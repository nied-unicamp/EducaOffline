package br.niedunicamp.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.GradeConfig;

@Repository
public interface GradeConfigRepository extends PagingAndSortingRepository<GradeConfig, Long> {

    // Course findById(Long id);

    GradeConfig findByCourse(Course course);

    List<GradeConfig> findByFinalGradesReleasedNull();

    List<GradeConfig> findByFinalGradesReleasedNotNull();
}
