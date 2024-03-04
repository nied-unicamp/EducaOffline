package br.niedunicamp.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import br.niedunicamp.model.ActivitySubmission;

@Repository
public interface ActivitySubmissionRepository extends PagingAndSortingRepository<ActivitySubmission, Long> {


    //ActivitySubmission findById(Long id);

}
