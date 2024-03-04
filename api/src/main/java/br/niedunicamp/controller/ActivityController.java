package br.niedunicamp.controller;

import java.util.Date;
// #region IMPORTS
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Activity;
import br.niedunicamp.model.Course;
import br.niedunicamp.pojo.ActivityDTO;
import br.niedunicamp.pojo.ActivityListByGrade;
import br.niedunicamp.pojo.FileUploaded;
import br.niedunicamp.service.ActivityService;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.FileStorageService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;
//#endregion

@CrossOrigin
@Api(value = "ActivityController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequestMapping("/v1/courses/{courseId}/activities")
public class ActivityController {

    // #region Services and Repositories
    @Autowired
    private ActivityService activityService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private CoreService coreService;
    // #endregion

    /**************************************
     * CRUD
     *******************************************/

    @GetMapping
    @ApiOperation("List activities")
    public ResponseEntity<List<Activity>> list(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        Boolean canSeeAnyActivity = coreService.hasPermission("list_all_activities", courseId, userDetails);
        Boolean canSeePublished = coreService.hasPermission("list_published_activities", courseId, userDetails);

        if (canSeeAnyActivity) {
            return activityService.list(course);
        } else if (canSeePublished) {
            return activityService.listPublished(course);
        }

        throw new UserNotAuthorized("User not authorized!");
    }

    @GetMapping("byGrade")
    @ApiOperation("List graded activities")
    public ResponseEntity<ActivityListByGrade> listByGrade(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.isMember(userDetails, courseId))
            throw new UserNotAuthorized("User not in this course!");

        return activityService.listByGrade(course, userDetails);
    }

    @GetMapping("{activityId}")
    @ApiOperation("Get activity")
    public ResponseEntity<Activity> get(@PathVariable Long courseId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Activity activity = coreService.validateActivity(courseId, activityId);
        Date now = coreService.now();

        Boolean canSeeAnyActivity = coreService.hasPermission("list_all_activities", courseId, userDetails);
        Boolean canSeeThisPublished = activity.getPublishDate().before(now)
                && coreService.hasPermission("list_published_activities", courseId, userDetails);

        if (!canSeeAnyActivity && !canSeeThisPublished) {
            throw new UserNotAuthorized("User not authorized");
        }

        return activityService.getWithFiles(activity);
    }

    @PostMapping
    @ApiOperation("Create activity")
    public ResponseEntity<Activity> create(@RequestBody ActivityDTO activity, @PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("create_activities", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return activityService.create(activity, course, userDetails);
    }

    @DeleteMapping("{activityId}")
    @ApiOperation("Delete activity")
    public ResponseEntity<?> delete(@PathVariable Long activityId, @PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        if (!coreService.hasPermission("delete_activities", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return activityService.delete(activity);
    }

    @PutMapping("{activityId}")
    @ApiOperation("Update activity")
    public ResponseEntity<Activity> update(@PathVariable Long activityId, @PathVariable Long courseId,
            @RequestBody ActivityDTO activityDTO, @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        if (!coreService.hasPermission("update_activities", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return activityService.update(activityDTO, activity, userDetails);
    }

    // #region
    // **************************************FILES*******************************************/

    @PostMapping("{activityId}/files")
    @ApiOperation("Upload files")
    public ResponseEntity<List<FileUploaded>> uploadFiles(@RequestParam MultipartFile[] files,
            @PathVariable Long courseId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Activity activity = coreService.validateActivity(courseId, activityId);

        if (!coreService.hasPermission("update_activities", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return fileStorageService.upload(files, activity.getFilesFolder());
    }

    @GetMapping("{activityId}/files/{fileName:.+}")
    @ApiOperation("Download file")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, @PathVariable Long courseId,
            @PathVariable Long activityId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        if (!coreService.hasPermission("list_published_activities", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return fileStorageService.download(fileName, activity.getFilesFolder());
    }

    //TODO: API operation to download multiple files

    @GetMapping("{activityId}/files")
    @ApiOperation("List files")
    public ResponseEntity<List<FileUploaded>> loadAllFilesFromFolder(@PathVariable Long courseId,
            @PathVariable Long activityId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        if (!coreService.hasPermission("list_published_activities", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return fileStorageService.listFiles(activity.getFilesFolder());
    }

    @DeleteMapping("{activityId}/files")
    @ApiOperation("Delete files")
    public ResponseEntity<?> deleteFiles(@PathVariable Long courseId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Activity activity = coreService.validateActivity(courseId, activityId);

        if (!coreService.hasPermission("update_activities", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return fileStorageService.deleteFolder(activity, true);
    } 

    @DeleteMapping("{activityId}/files/{fileName:.+}")
    @ApiOperation("Delete a file")
    public ResponseEntity<?> deleteFiles(@PathVariable Long courseId, @PathVariable Long activityId,
            @PathVariable String fileName, @AuthenticationPrincipal UserDetails userDetails) {

        Activity activity = coreService.validateActivity(courseId, activityId);

        if (!coreService.hasPermission("update_activities", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return fileStorageService.deleteFile(fileName, activity);
    }
    // #endregion
}