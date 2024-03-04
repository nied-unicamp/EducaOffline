package br.niedunicamp.controller;

import java.util.Date;
import java.util.List;

//#region Imports
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

import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Activity;
import br.niedunicamp.model.ActivityItem;
import br.niedunicamp.model.ActivitySubmission;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.ActivitySubmissionDTO;
import br.niedunicamp.pojo.FileUploaded;
import br.niedunicamp.service.ActivitySubmissionService;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.FileStorageService;
import br.niedunicamp.service.GradesService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;
//#endregion

@CrossOrigin
@Api(value = "ActivitySubmissionController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequestMapping("/v1/courses/{courseId}/activities/{activityId}")
public class ActivitySubmissionController {

    // #region Services and Repositories
    @Autowired
    private ActivitySubmissionService submissionService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private CoreService coreService;

    @Autowired
    private GradesService gradesService;
    // #endregion

    /********************************* CRUD *********************************/

    @GetMapping("items/{userId}/submission")
    @ApiOperation("Get Specific User Submission")
    public ResponseEntity<ActivitySubmission> get(@PathVariable Long courseId, @PathVariable Long activityId,
            @PathVariable Long userId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);
        User user = coreService.validateUser(userId);

        ActivityItem activityItem = gradesService.get(activity, user, userDetails).getBody();

        // Check general permission
        if (!coreService.hasPermission("list_all_submissions", courseId, userDetails)) {
            User me = coreService.validateUser(userDetails);

            // If this is not your user, block it
            if (me.getId() != user.getId()) {
                throw new UserNotAuthorized("You do not have permission to see this submission");
            }

            // If no item, return no evaluation
            if (!(activityItem instanceof ActivityItem)) {
                throw new ResourceNotFoundException("Submission not found!");
            }

            // Return your evaluation
            return ResponseEntity.ok(activityItem.getSubmission());
        }

        if(activityItem instanceof ActivityItem)
            return ResponseEntity.ok(activityItem.getSubmission());
        else
            throw new ResourceNotFoundException("Submission not found!");
    }

    @GetMapping("submission")
    @ApiOperation("Get Submission")
    public ResponseEntity<ActivitySubmission> get(@PathVariable Long courseId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);
        User user = coreService.validateUser(userDetails);

        ActivityItem activityItem = gradesService.get(activity, user, userDetails).getBody();

        if(activityItem instanceof ActivityItem)
            return ResponseEntity.ok(activityItem.getSubmission());
        else
            throw new ResourceNotFoundException("Submission not found!");
    }

    @PostMapping("submission")
    @ApiOperation("Create Submission")
    public ResponseEntity<ActivitySubmission> create(@RequestBody ActivitySubmissionDTO submissionDTO,
            @PathVariable Long courseId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        if (!coreService.hasPermission("create_activity_submissions", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized to create submissions in this course");

        Date now = coreService.now();
        if (now.after(activity.getSubmissionEnd()) || now.before(activity.getSubmissionBegin())) {
            throw new UserNotAuthorized("Not authorized to create submission outside of submission date range");
        }

        User me = coreService.validateUser(userDetails);

        ActivityItem activityItem = gradesService.get(activity, me, userDetails).getBody();

        if (activityItem instanceof ActivityItem && activityItem.getSubmission() instanceof ActivitySubmission) {
            throw new UserNotAuthorized("Submission already created!");
        }

        return submissionService.create(submissionDTO, activity, userDetails);
    }

    @PutMapping("submission")
    @ApiOperation("Update Submission")
    public ResponseEntity<ActivitySubmission> updateSubmission(@PathVariable Long activityId,
            @PathVariable Long courseId, @RequestBody ActivitySubmissionDTO submissionDTO,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        if (!coreService.hasPermission("update_activity_submissions", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return submissionService.update(submissionDTO, activity, userDetails);
    }

    @DeleteMapping("submission")
    @ApiOperation("Delete Submission")
    public ResponseEntity<?> deleteSubmission(@PathVariable Long activityId, @PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        if (!coreService.hasPermission("update_activity_submissions", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return submissionService.delete(activity, userDetails);
    }

    /**************************************
     * FILES
     **************************************/

    @PostMapping("submission/files")
    @ApiOperation("Add files for my submission")
    public ResponseEntity<List<FileUploaded>> uploadFiles(@RequestParam MultipartFile[] files,
            @PathVariable Long courseId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        Date now = coreService.now();
        if (now.after(activity.getSubmissionEnd()) || now.before(activity.getSubmissionBegin())) {
            throw new UserNotAuthorized("Not authorized to modify submission outside of submission date range");
        }

        User user = coreService.validateUser(userDetails);

        ActivityItem activityItem = gradesService.get(activity, user, userDetails).getBody();

        if (activityItem == null || activityItem.getSubmission() == null) {
            throw new ResourceNotFoundException("Submission not found!");
        }

        ActivitySubmission submission = activityItem.getSubmission();

        return fileStorageService.upload(files, activity.getFilesFolder() + submission.getFilesFolder());
    }

    @GetMapping("submission/files")
    @ApiOperation("View files from my submission")
    public ResponseEntity<List<FileUploaded>> loadMyFiles(@PathVariable Long courseId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        User user = coreService.validateUser(userDetails);

        ActivityItem activityItem = gradesService.get(activity, user, userDetails).getBody();

        if (activityItem == null || activityItem.getSubmission() == null) {
            throw new ResourceNotFoundException("Submission not found!");
        }

        ActivitySubmission submission = activityItem.getSubmission();

        return fileStorageService.listFiles(activity.getFilesFolder() + submission.getFilesFolder());
    }

    @GetMapping("items/{userId}/submission/files")
    @ApiOperation("View files of a user's submission")
    public ResponseEntity<List<FileUploaded>> loadAllFilesFromUser(@PathVariable Long courseId,
            @PathVariable Long userId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        User user = coreService.validateUser(userId);
        User me = coreService.validateUser(userDetails);

        if (me.getId() != user.getId() && !coreService.hasPermission("list_all_submissions", courseId, userDetails)) {
            throw new UserNotAuthorized("You do not have permission to see this submission");
        }

        ActivityItem activityItem = gradesService.get(activity, user, userDetails).getBody();

        if (activityItem == null || activityItem.getSubmission() == null) {
            throw new ResourceNotFoundException("Submission not found!");
        }

        ActivitySubmission submission = activityItem.getSubmission();

        return fileStorageService.listFiles(activity.getFilesFolder() + submission.getFilesFolder());
    }

    @GetMapping("submission/files/{fileName:.+}")
    @ApiOperation("Download a file from my submission")
    public ResponseEntity<Resource> downloadMyFile(@PathVariable String fileName, @PathVariable Long courseId,
            @PathVariable Long activityId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        User user = coreService.validateUser(userDetails);

        ActivityItem activityItem = gradesService.get(activity, user, userDetails).getBody();

        if (activityItem == null || activityItem.getSubmission() == null) {
            throw new ResourceNotFoundException("Submission not found!");
        }

        ActivitySubmission submission = activityItem.getSubmission();

        return fileStorageService.download(fileName, activity.getFilesFolder() + submission.getFilesFolder());
    }

    @GetMapping("items/{userId}/submission/files/{fileName:.+}")
    @ApiOperation("Download a file from some user's submission")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, @PathVariable Long courseId,
            @PathVariable Long userId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        User user = coreService.validateUser(userId);
        User me = coreService.validateUser(userDetails);

        if (me.getId() != user.getId() && !coreService.hasPermission("list_all_submissions", courseId, userDetails)) {
            throw new UserNotAuthorized("You do not have permission to see this submission");
        }

        ActivityItem activityItem = gradesService.get(activity, user, userDetails).getBody();

        if (activityItem == null || activityItem.getSubmission() == null) {
            throw new ResourceNotFoundException("Submission not found!");
        }

        ActivitySubmission submission = activityItem.getSubmission();

        return fileStorageService.download(fileName, activity.getFilesFolder() + submission.getFilesFolder());
    }

    @DeleteMapping("submission/files")
    @ApiOperation("Delete all files from my submission")
    public ResponseEntity<?> deleteFiles(@PathVariable Long courseId, @PathVariable Long activityId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        Date now = coreService.now();
        if (now.after(activity.getSubmissionEnd()) || now.before(activity.getSubmissionBegin())) {
            throw new UserNotAuthorized("Not authorized to modify submission outside of submission date range");
        }

        User user = coreService.validateUser(userDetails);

        ActivityItem activityItem = gradesService.get(activity, user, userDetails).getBody();

        if (activityItem == null || activityItem.getSubmission() == null) {
            throw new ResourceNotFoundException("Submission not found!");
        }

        ActivitySubmission submission = activityItem.getSubmission();

        return fileStorageService.deleteFolder(activity.getFilesFolder() + submission.getFilesFolder(), true);
    }

    @DeleteMapping("submission/files/{fileName:.+}")
    @ApiOperation("Delete a file from my submission")
    public ResponseEntity<?> deleteFile(@PathVariable String fileName, @PathVariable Long courseId,
            @PathVariable Long activityId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Activity activity = coreService.validateActivity(courseId, activityId);

        Date now = coreService.now();
        if (now.after(activity.getSubmissionEnd()) || now.before(activity.getSubmissionBegin())) {
            throw new UserNotAuthorized("Not authorized to modify submission outside of submission date range");
        }

        User user = coreService.validateUser(userDetails);

        ActivityItem activityItem = gradesService.get(activity, user, userDetails).getBody();

        if (activityItem == null || activityItem.getSubmission() == null) {
            throw new ResourceNotFoundException("Submission not found!");
        }

        ActivitySubmission submission = activityItem.getSubmission();
        return fileStorageService.deleteFile(fileName, activity.getFilesFolder() + submission.getFilesFolder());
    }
}