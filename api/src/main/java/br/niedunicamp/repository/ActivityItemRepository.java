package br.niedunicamp.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import br.niedunicamp.model.Activity;
import br.niedunicamp.model.ActivityEvaluation;
import br.niedunicamp.model.ActivityItem;
import br.niedunicamp.model.ActivitySubmission;
import br.niedunicamp.model.User;

@Repository
public interface ActivityItemRepository extends PagingAndSortingRepository<ActivityItem, Long> {


    List<ActivityItem> findByUserId(User user);

    ActivityItem findByActivityAndUser(Activity activity, User user);

    List<ActivityItem> findByActivity(Activity activity);

    ActivityItem findBySubmission(ActivitySubmission submission);

    ActivityItem findByEvaluation(ActivityEvaluation evaluation);
}
