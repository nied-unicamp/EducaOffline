package br.niedunicamp.controller;

//#region Imports
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Activity;
import br.niedunicamp.model.ActivityItem;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.GradeConfig;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.ActivityAverageGrade;
import br.niedunicamp.pojo.ActivityGradesSummary;
import br.niedunicamp.pojo.FinalGrade;
import br.niedunicamp.pojo.GradeConfigDTO;
import br.niedunicamp.pojo.GradesOverview;
import br.niedunicamp.pojo.GradesUserOverview;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.GradesService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;
//#endregion

@CrossOrigin
@Api(value = "ActivitySubmissionController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequestMapping("/v1/courses/{courseId}/grades")
public class GradesController {

    // #region Services and Repositories
    @Autowired
    private GradesService gradesService;

    @Autowired
    private CoreService coreService;
    // #endregion

    @GetMapping("overview")
    @ApiOperation("Get all grades for this course")
    public ResponseEntity<GradesOverview> overview(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("list_all_submissions", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }

        return gradesService.overview(course);
    }

    @GetMapping("users/{userId}/overview")
    @ApiOperation("Get all grades info for an specific person")
    public ResponseEntity<GradesUserOverview> userOverview(@PathVariable Long courseId, @PathVariable Long userId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);
        User me = coreService.validateUser(userDetails);
        User user = coreService.validateUser(userId);

        if (user.getId() != me.getId() && !coreService.hasPermission("list_all_submissions", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }

        return gradesService.userOverview(course, user);
    }

    // ----------------- My grades ---------------------------//

    @GetMapping()
    @ApiOperation("List my grades in a course")
    public ResponseEntity<List<ActivityItem>> listMyGrades(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);
        User user = coreService.validateUser(userDetails);

        if (!coreService.isMember(userDetails, courseId)) {
            throw new UserNotAuthorized("You are not member of this course");
        }

        return gradesService.list(course, user, userDetails);
    }

    @GetMapping("{activityId}")
    @ApiOperation("Get my grade in an activity")
    public ResponseEntity<ActivityItem> getMyGrade(@PathVariable Long courseId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);
        User user = coreService.validateUser(userDetails);

        if (!coreService.isMember(userDetails, courseId)) {
            throw new UserNotAuthorized("You are not member of this course");
        }

        return gradesService.get(activity, user, userDetails);
    }

    @GetMapping("result")
    @ApiOperation("Get my final grade")
    public ResponseEntity<FinalGrade> getMyFinalGrade(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);
        User user = coreService.validateUser(userDetails);

        if (!coreService.isMember(userDetails, courseId)) {
            throw new UserNotAuthorized("You are not member of this course");
        }

        return gradesService.getFinalGrade(course, user);
    }

    // ----------------- Config ---------------------------- //

    @GetMapping("config")
    @ApiOperation("Get grades configuration")
    public ResponseEntity<GradeConfig> getConfig(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.isMember(userDetails, courseId)) {
            throw new UserNotAuthorized("You are not member of this course");
        }
        // TODO: Remove scheduled activities from the graded activities if the user cant
        // see it
        return gradesService.getConfig(course);
    }

    @PostMapping("config")
    @ApiOperation("Set grades configuration")
    public ResponseEntity<GradeConfig> setConfig(@PathVariable Long courseId,
            @RequestBody GradeConfigDTO gradeConfigDTO, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("list_all_submissions", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }

        return gradesService.updateWeights(course, gradeConfigDTO, userDetails);
    }

    @PostMapping("config/release")
    @ApiOperation("Release the course final grade")
    public ResponseEntity<GradeConfig> releaseFinal(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("list_all_submissions", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }

        return gradesService.release(course, userDetails);
    }

    @PostMapping("config/useAverage")
    @ApiOperation("Use arithmetic mean to calculate the course final grade")
    public ResponseEntity<GradeConfig> useAverage(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("list_all_submissions", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }

        return gradesService.useArithmeticMean(course, userDetails);
    }

    // ---------------- Grades from others ---------------------------- //

    // ------------ Final grade of everyone ------------------//

    @GetMapping("results")
    @ApiOperation("List final grades")
    public ResponseEntity<List<FinalGrade>> getFinalGrades(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("list_all_submissions", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }
        return gradesService.listFinalGrades(course);
    }

    // ------------ Grades of someone ----------------------- //

    @GetMapping("users/{userId}/activities/{activityId}")
    @ApiOperation("List someone grade in an activity")
    public ResponseEntity<ActivityItem> listUserGrades(@PathVariable Long courseId, @PathVariable Long userId,
            @PathVariable Long activityId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        User user = coreService.validateUser(userId);
        User me = coreService.validateUser(userDetails);
        Activity activity = coreService.validateActivity(courseId, activityId);

        if (!coreService.hasPermission("list_all_submissions", courseId, userDetails) && user.getId() != me.getId()) {
            throw new UserNotAuthorized("User not authorized");
        }

        return gradesService.get(activity, user, userDetails);
    }

    @GetMapping("users/{userId}/activities")
    @ApiOperation("List someone's grades in activities inside a course")
    public ResponseEntity<List<ActivityItem>> listUserGrades(@PathVariable Long courseId, @PathVariable Long userId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);
        User user = coreService.validateUser(userId);
        User me = coreService.validateUser(userDetails);

        if (!coreService.hasPermission("list_all_submissions", courseId, userDetails) && user.getId() != me.getId()) {
            throw new UserNotAuthorized("User not authorized");
        }

        return gradesService.list(course, user, userDetails);
    }

    @GetMapping("users/{userId}/result")
    @ApiOperation("List final grade")
    public ResponseEntity<FinalGrade> getFinalGrade(@PathVariable Long courseId, @PathVariable Long userId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);
        User user = coreService.validateUser(userId);

        if (!coreService.hasPermission("list_all_submissions", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }

        return gradesService.getFinalGrade(course, user);
    }

    // ------------ By an activity ----------------------- //

    @GetMapping("activities/{activityId}")
    @ApiOperation("List activity grades")
    public ResponseEntity<List<ActivityItem>> listActivityGradesSummary(@PathVariable Long courseId,
            @PathVariable Long activityId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        if (!coreService.isMember(userDetails, courseId)) {
            throw new UserNotAuthorized("You are not member of this course");
        }

        return gradesService.list(activity, userDetails);
    }

    @PostMapping("activities/{activityId}/release")
    @ApiOperation("Release activity grades")
    public ResponseEntity<Activity> release(@PathVariable Long courseId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        if (!coreService.hasPermission("create_activity_evaluation", courseId, userDetails)) {
            throw new UserNotAuthorized("You cant release grades in this course");
        }

        return gradesService.release(activity, userDetails);
    }

    @GetMapping("activities/summary")
    @ApiOperation("List summaries for graded activities")
    public ResponseEntity<List<ActivityGradesSummary>> listActivities(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("list_all_submissions", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }

        return gradesService.listActivities(course);
    }

    @GetMapping("activities/average")
    @ApiOperation("List average grades for activities")
    public ResponseEntity<Set<ActivityAverageGrade>> listAverages(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.isMember(userDetails, courseId)) {
            throw new UserNotAuthorized("You are not member of this course");
        }

        return gradesService.listAverageGrades(course);
    }

    @GetMapping("activities/{activityId}/average")
    @ApiOperation("List average grades for activities")
    public ResponseEntity<ActivityAverageGrade> listAverages(@PathVariable Long courseId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        if (!coreService.isMember(userDetails, courseId)) {
            throw new UserNotAuthorized("You are not member of this course");
        }
        Activity activity = coreService.validateActivity(courseId, activityId);

        return gradesService.getAverageGrade(activity);
    }
}