package br.niedunicamp.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.Share;

@Repository
public interface ShareRepository extends PagingAndSortingRepository<Share, Long> {

    // Share findById(Long shareId);

    List<Share> findByCourse(Course course);

    // List<Share> findByUsers(User user);
}
