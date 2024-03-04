package br.niedunicamp.controller;

//#region Imports
import java.util.List;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.Participation;
import br.niedunicamp.model.Role;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.RolesAndCourses;
import br.niedunicamp.pojo.UserIdAndRoleId;
import br.niedunicamp.repository.RoleRepository;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.ParticipationService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;
//#endregion

@CrossOrigin
@Api(value = "ParticipationController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequestMapping("/v1")
public class ParticipationController {

    // #region Repos and Services
    @Autowired
    private ParticipationService participationService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CoreService coreService;
    // #endregion

    @PostMapping(path = "courses/{courseId}/users")
    @ApiOperation("Add an user to a course")
    public ResponseEntity<Participation> enrollUser(@RequestBody UserIdAndRoleId userAndRole,
            @PathVariable Long courseId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);
        User user = coreService.validateUser(userAndRole.userId);
        Role role = coreService.validateRole(userAndRole.roleId);

        if (!coreService.hasPermission("add_users_to_course", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return participationService.create(user, course, role);
    }

    @GetMapping(path = "courses/{courseId}/users")
    @ApiOperation("List all participations")
    public ResponseEntity<List<Participation>> listUsersAndRoles(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("list_course_users", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return participationService.findByCourse(course);
    }

    @GetMapping(path = "users/{userId}/roles/{roleId}")
    @ApiOperation("List all participations")
    public ResponseEntity<List<Course>> listCourses(@PathVariable Long userId, @PathVariable Long roleId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        User user = coreService.validateUser(userId);
        Role role = coreService.validateRole(roleId);

        return participationService.findByUserAndRole(user, role);
    }

    @GetMapping(path = "users/{userId}/roles")
    @ApiOperation("List all courses by role")
    public ResponseEntity<RolesAndCourses> listUserCoursesAndRoles(@PathVariable Long userId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        User user = coreService.validateUser(userId);

        return participationService.listUserCoursesAndRoles(user);
    }

    @GetMapping(path = "me/roles")
    @ApiOperation("List all courses by role")
    public ResponseEntity<RolesAndCourses> listMyCoursesAndRoles(
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        User user = coreService.validateUser(userDetails);

        return participationService.listUserCoursesAndRoles(user);
    }

    @GetMapping("courses/{courseId}/roles/{roleId}")
    @ApiOperation("List all participations")
    public ResponseEntity<List<User>> listUsers(@PathVariable Long courseId, @PathVariable Long roleId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);
        Role role = coreService.validateRole(roleId);

        if (!coreService.hasPermission("list_course_users", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return participationService.findByCourseAndRole(course, role);
    }

    @GetMapping(path = "users/{userId}/courses")
    @ApiOperation("Find all courses by user")
    public ResponseEntity<List<Course>> findByUser(@PathVariable Long userId) {
        User user = coreService.validateUser(userId);

        return participationService.findCoursesByUser(user);
    }

    @GetMapping(path = "users/{userId}/courses/active")
    @ApiOperation("Get the active course of an user")
    public ResponseEntity<List<Course>> getActiveCoursesByUser(@PathVariable Long userId) {
        User user = coreService.validateUser(userId);

        return participationService.findActiveCoursesByUser(user);
    }

    @GetMapping(path = "users/{userId}/courses/inactive")
    @ApiOperation("Get inactive courses of an user")
    public ResponseEntity<List<Course>> getInactiveCoursesByUser(@PathVariable Long userId) {
        User user = coreService.validateUser(userId);

        return participationService.findInactiveCoursesByUser(user);
    }

    @GetMapping(path = { "users/{userId}/courses/{courseId}", "courses/{courseId}/users/{userId}" })
    @ApiOperation("Get the role of an user in a course")
    public ResponseEntity<Role> getRole(@PathVariable Long userId, @PathVariable Long courseId) {
        User user = coreService.validateUser(userId);
        Course course = coreService.validateCourse(courseId);

        if (user.getIsAdmin()) {
            return ResponseEntity.ok(roleRepository.findByName("ADMIN"));
        }

        return participationService.findByUserAndCourse(user, course);
    }

    @PostMapping(path = "courses/enter/{courseKey}")
    @ApiOperation(value = "Enroll in course using a key")
    public ResponseEntity<Participation> enterByKey(
        @PathVariable String courseKey,
        @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        return participationService.enrollByKey(courseKey, userDetails);
    }

    @DeleteMapping(path = { "courses/{courseId}/users/{userId}", "users/{userId}/courses/{courseId}" })
    @ApiOperation("Remove user from course")
    public ResponseEntity<?> delete(@PathVariable Long userId, @PathVariable Long courseId) {
        Course course = coreService.validateCourse(courseId);
        User user = coreService.validateUser(userId);

        return participationService.delete(user, course);
    }

}