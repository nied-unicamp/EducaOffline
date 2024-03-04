package br.niedunicamp.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.Group;

@Repository
public interface GroupRepository extends PagingAndSortingRepository<Group, Long> {

    List<Group> findByCourse(Course course);

    // @Query("SELECT g FROM Group AS g WHERE :user MEMBER OF d.accessors")
    // List<Group> findByCourseAndContainingUser(Course course, User user);
    // Group findById(Long id);
}
