package br.niedunicamp.controller;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.niedunicamp.model.Activity;
import br.niedunicamp.model.ActivityItem;
import br.niedunicamp.model.User;
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
@RequestMapping("/v1/courses/{courseId}/activities/{activityId}/items")
public class ActivityItemController {

    // #region Services and Repositories
    @Autowired
    private CoreService coreService;

    @Autowired
    private GradesService gradesService;
    // #endregion

    /********************************* CRUD *********************************/

    @GetMapping
    @ApiOperation("List activity items")
    public ResponseEntity<List<ActivityItem>> list(@PathVariable Long courseId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);
        User user = coreService.validateUser(userDetails);

        // If you can`t see all evaluations, show only yours if grades were released
        if (!coreService.hasPermission("get_all_evaluations", courseId, userDetails)) {
            // Get your item
            ActivityItem response = gradesService.get(activity, user, userDetails).getBody();
            List<ActivityItem> list = Arrays.asList();

            if (response instanceof ActivityItem) {
                Date releaseDate = response.getActivity().getGradesReleaseDate();
                Date now = coreService.now();

                // If there's no grade release date or it is scheduled to the future
                // Remove the evaluation
                if (!(releaseDate instanceof Date) || releaseDate.after(now)) {
                    response.setEvaluation(null);
                }

                list.add(response);
            }
            return ResponseEntity.ok(list);
        }
        return gradesService.list(activity, userDetails);
    }

    @GetMapping("{userId}")
    @ApiOperation("Get activity item by user")
    public ResponseEntity<ActivityItem> list(@PathVariable Long courseId, @PathVariable Long activityId, @PathVariable Long userId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Activity activity = coreService.validateActivity(courseId, activityId);
        User user = coreService.validateUser(userId);

        // If you can`t see all evaluations, show only yours if grades were released
        if (!coreService.hasPermission("get_all_evaluations", courseId, userDetails)) {
            // Get your item
            ActivityItem response = gradesService.get(activity, user, userDetails).getBody();

            if (response instanceof ActivityItem) {
                Date releaseDate = response.getActivity().getGradesReleaseDate();
                Date now = coreService.now();

                // If there's no grade release date or it is scheduled to the future
                // Remove the evaluation
                if (!(releaseDate instanceof Date) || releaseDate.after(now)) {
                    response.setEvaluation(null);
                }
            }
            return ResponseEntity.ok(response);
        }
        return gradesService.get(activity, user, userDetails);
    }
}