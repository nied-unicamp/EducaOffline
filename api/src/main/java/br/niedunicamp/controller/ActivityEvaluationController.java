package br.niedunicamp.controller;

// #region IMPORTS
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Activity;
import br.niedunicamp.model.ActivityEvaluation;
import br.niedunicamp.model.ActivityItem;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.ActivityEvaluationDTO;
import br.niedunicamp.service.ActivityEvaluationService;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.GradesService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;
// #endregion

@CrossOrigin
@Api(value = "ActivityEvaluationController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequestMapping("/v1/courses/{courseId}/activities/{activityId}")
public class ActivityEvaluationController {

    // #region Services and Repositories
    @Autowired
    private CoreService coreService;

    @Autowired
    private ActivityEvaluationService evaluationService;

    @Autowired
    private GradesService gradesService;
    // #endregion

    /********************************* CRUD *********************************/

    @GetMapping("items/{userId}/evaluation")
    @ApiOperation("Get evaluation")
    public ResponseEntity<ActivityEvaluation> get(@PathVariable Long courseId, @PathVariable Long activityId,
            @PathVariable Long userId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);
        User user = coreService.validateUser(userId);

        ActivityItem activityItem = gradesService.get(activity, user, userDetails).getBody();

        // Check general permission
        if (!coreService.hasPermission("get_all_evaluations", courseId, userDetails)) {
            User me = coreService.validateUser(userDetails);

            // If this is not your user, block it
            if (me.getId() != user.getId()) {
                throw new UserNotAuthorized("You do not have permission to see this evaluation");
            }

            // If no item, or no release date or scheduled date
            // Return no evaluation
            if (!(activityItem instanceof ActivityItem)
                    || !(activity.getGradesReleaseDate() instanceof Date)
                    || activity.getGradesReleaseDate().after(coreService.now())) {

                return ResponseEntity.ok(null);
            }

            // Return your evaluation
            return ResponseEntity.ok(activityItem.getEvaluation());
        }

        return ResponseEntity.ok(activityItem instanceof ActivityItem ? activityItem.getEvaluation() : null);
    }

    @PostMapping("items/{userId}/evaluation")
    @ApiOperation("Evaluate")
    public ResponseEntity<ActivityEvaluation> create(@PathVariable Long courseId, @PathVariable Long activityId,
            @PathVariable Long userId, @RequestBody ActivityEvaluationDTO evaluationDTO,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);
        User user = coreService.validateUser(userId);

        if (!coreService.hasPermission("create_activity_evaluation", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return evaluationService.create(evaluationDTO, activity, user, userDetails);
    }

    @PutMapping("items/{userId}/evaluation")
    @ApiOperation("Update Evaluation")
    public ResponseEntity<ActivityEvaluation> update(@PathVariable Long courseId, @PathVariable Long activityId,
            @PathVariable Long userId, @RequestBody ActivityEvaluationDTO evaluationDTO,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);
        User user = coreService.validateUser(userId);

        if (!coreService.hasPermission("update_activity_evaluation", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return evaluationService.update(evaluationDTO, activity, user, userDetails);
    }

    @DeleteMapping("items/{userId}/evaluation")
    @ApiOperation("Delete Evaluation")
    public ResponseEntity<?> delete(@PathVariable Long courseId, @PathVariable Long activityId,
            @PathVariable Long userId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);
        User user = coreService.validateUser(userId);

        if (!coreService.hasPermission("delete_activity_evaluation", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return evaluationService.delete(activity, user, userDetails);
    }

    @GetMapping("evaluation")
    @ApiOperation("Get my evaluation")
    public ResponseEntity<ActivityEvaluation> get(@PathVariable Long courseId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);
        User user = coreService.validateUser(userDetails);

        ActivityItem activityItem = gradesService.get(activity, user, userDetails).getBody();

        // Check general permission
        if (!coreService.hasPermission("get_all_evaluations", courseId, userDetails)) {
            // If no item, or no release date or scheduled date
            // Return no evaluation
            if (!(activityItem instanceof ActivityItem)
                    || !(activity.getGradesReleaseDate() instanceof Date)
                    || activity.getGradesReleaseDate().after(coreService.now())) {

                return ResponseEntity.ok(null);
            }

            // Return your evaluation
            return ResponseEntity.ok(activityItem.getEvaluation());
        }

        return ResponseEntity.ok(activityItem instanceof ActivityItem ? activityItem.getEvaluation() : null);
    }
}