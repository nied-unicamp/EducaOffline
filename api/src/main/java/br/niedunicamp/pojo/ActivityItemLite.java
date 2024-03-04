package br.niedunicamp.pojo;

import br.niedunicamp.model.ActivityEvaluation;
import br.niedunicamp.model.ActivityItem;
import br.niedunicamp.model.ActivitySubmission;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ActivityItemLite {
    private Long userId;
    private Long activityId;
    private ActivitySubmission activitySubmission;
    private ActivityEvaluation activityEvaluation;

    public ActivityItemLite(ActivityItem activityItem) {
        super();
        this.setUserId(activityItem.getUser().getId());
        this.setActivityEvaluation(activityItem.getEvaluation());
        this.setActivitySubmission(activityItem.getSubmission());
        this.setActivityId(activityItem.getActivity().getId());
    }
}