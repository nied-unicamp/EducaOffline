package br.niedunicamp.controller;

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

import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.Notification;
import br.niedunicamp.model.User;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.NotificationService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

@CrossOrigin
@Api(value = "NotificationController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
@RequestMapping("/v1/notifications")
public class NotificationController {

    // #region Repositories
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private CoreService coreService;
    // #endregion

    @GetMapping
    @ApiOperation("List notifications")
    public ResponseEntity<List<Notification>> list(@ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        User user = coreService.validateUser(userDetails);

        return notificationService.listForUser(user);
    }

    @GetMapping("courses/{courseId}")
    @ApiOperation("List notifications")
    public ResponseEntity<List<Notification>> listForCourse(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Course course = coreService.validateCourse(courseId);
        User user = coreService.validateUser(userDetails);

        if (!coreService.isMember(userDetails, courseId)) {
            throw new UserNotAuthorized("User is not a member of this course");
        }

        return notificationService.listForUserAndCourse(user, course);
    }

}