package br.niedunicamp.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import br.niedunicamp.model.ActivityEvaluation;

@Repository
public interface ActivityEvaluationRepository extends PagingAndSortingRepository<ActivityEvaluation, Long> {

    // ActivityEvaluation findById(Long id);
}
