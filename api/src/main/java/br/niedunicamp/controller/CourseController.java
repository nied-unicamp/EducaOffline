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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.niedunicamp.exception.InvalidFieldException;
import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.CourseDTO;
import br.niedunicamp.pojo.CourseKey;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.CourseService;
import br.niedunicamp.service.ParticipationService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;
//#endregion

@CrossOrigin
@Api(value = "CourseController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequestMapping("/v1/courses")
public class CourseController {

    // #region Repositories
    @Autowired
    private CourseService courseService;

    @Autowired
    private CoreService coreService;

    @Autowired
    private ParticipationService participationService;

    @Autowired
    private UserRepository userRepository;
    // #endregion

    @CrossOrigin
    @PostMapping
    @ApiOperation("Save Course")
    public ResponseEntity<Course> saveCourse(@RequestBody CourseDTO courseDTO,
    @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
    coreService.validateAdmin(userDetails);

    return courseService.create(courseDTO, userDetails);
    }

    @DeleteMapping("{courseId}")
    @ApiOperation("Delete Course")
    public ResponseEntity<?> delete(@PathVariable Long courseId, 
                                    @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);
        Course course = coreService.validateCourse(courseId);

        return courseService.delete(course);
    }

    @PutMapping("{courseId}")
    @ApiOperation("Update Course")
    public ResponseEntity<Course> updateCourse(@RequestBody CourseDTO courseDTO, @PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("edit_course", courseId, userDetails)) {
            throw new UserNotAuthorized("This user can not edit this course.");
        }

        try {
            return courseService.update(course, courseDTO);
        } catch (IllegalArgumentException e) {
           throw new InvalidFieldException(e.getMessage());
        }
    }

    @GetMapping("{courseId}")
    @ApiOperation("Find Course By Id")
    public ResponseEntity<Course> findCourseByCourseId(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        return courseService.get(course);
    }

    @GetMapping("key/{key}")
    @ApiOperation("Find Course By Key")
    public ResponseEntity<Course> findByCourseKey(@PathVariable String key) {
        return courseService.findByKey(key);
    }

    @GetMapping("open/key/{key}")
    @ApiOperation("Find Open Course By Key")
    public ResponseEntity<Course> findOpenCourseByCourseKey(@PathVariable String key) {
        return courseService.findOpenCourseByKey(key);
    }

    @GetMapping("{courseId}/key")
    @ApiOperation("Get the key of a course")
    public ResponseEntity<CourseKey> getKey(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("get_course_key", courseId, userDetails)) {
            throw new UserNotAuthorized("You do not have permission to view the course key.");
        }

        return courseService.getKey(course);
    }

    @PutMapping("{courseId}/key")
    @ApiOperation("Refresh the key of a course")
    public ResponseEntity<CourseKey> refreshKey(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("edit_course_key", courseId, userDetails)) {
            throw new UserNotAuthorized("You do not have permission to edit the course key.");
        }

        return courseService.refreshKey(course);
    }

    @PutMapping("{courseId}/key/{key}")
    @ApiOperation("Change the key of a course")
    public ResponseEntity<CourseKey> setKey(@PathVariable Long courseId, @PathVariable String key,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("edit_course_key", courseId, userDetails)) {
            throw new UserNotAuthorized("You do not have permission to edit the course key.");
        }

        return courseService.setKey(course, key);
    }

    @GetMapping
    @ApiOperation(value = "Find Courses")
    public ResponseEntity<List<Course>> findCourses(@ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername());

        if (user.getIsAdmin()) {
            return courseService.listCourses();
        }

        return participationService.findCoursesByUser(user);
    }

    @GetMapping("active")
    @ApiOperation("Find Courses")
    public ResponseEntity<List<Course>> findActiveCourses(@ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername());

        if (user.getIsAdmin()) {
            return courseService.listActiveCourses();
        }

        return participationService.findActiveCoursesByUser(user);
    }

    @GetMapping("ended")
    @ApiOperation("Find Courses")
    public ResponseEntity<List<Course>> findInactiveCourses(
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        User user = coreService.validateUser(userDetails);

        if (user.getIsAdmin()) {
            return courseService.listEndedCourses();
        }

        return participationService.findInactiveCoursesByUser(user);
    }

    @GetMapping("open")
    @ApiOperation("Find Courses")
    public ResponseEntity<List<Course>> findOpenCourses(@ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        return courseService.listOpenSubscriptions();
    }
}
