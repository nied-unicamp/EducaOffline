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

import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.Group;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.GroupService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;
//#endregion

@CrossOrigin
@Api(value = "GroupController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequestMapping("/v1/courses/{courseId}/groups")
public class GroupController {

    // #region Repositories
    @Autowired
    private GroupService groupService;

    @Autowired
    private CoreService coreService;

    // @Autowired
    // private UserRepository userRepository;
    // #endregion

    @GetMapping
    @ApiOperation("List groups")
    public ResponseEntity<List<Group>> list(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Course course = coreService.validateCourse(courseId);

        if (!coreService.isMember(userDetails, courseId)) {
            throw new UserNotAuthorized("User not authorized!");
        }
        return groupService.list(course);
    }

    @PostMapping
    @ApiOperation("Create group")
    public ResponseEntity<Group> createDTO(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("create_group", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return groupService.create(course);
    }

    @DeleteMapping("{groupId}")
    @ApiOperation("Delete group")
    public ResponseEntity<?> delete(@PathVariable Long groupId, @PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Group group = coreService.validateGroup(courseId, groupId);

        if (!coreService.hasPermission("delete_groups", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return groupService.delete(group);
    }

    // @GetMapping("{groupId}")
    // @ApiOperation("Get group")
    // public ResponseEntity<Group> get(@PathVariable Long groupId, @PathVariable
    // Long courseId,
    // @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
    // Group item = coreService.validateGroup(courseId, groupId);
    // User user = userRepository.findByEmail(userDetails.getUsername());

    // if (!coreService.hasPermission("list_groups", item.getCourse().getId(),
    // userDetails)
    // && !item.getUsers().contains(user))
    // throw new UserNotAuthorized("User not authorized");

    // return ResponseEntity.ok(item);
    // }

    // @GetMapping("{groupId}/users/")
    // @ApiOperation("Get group")
    // public ResponseEntity<List<User>> getUsers(@PathVariable Long groupId,
    // @PathVariable Long courseId,
    // @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
    // Group item = coreService.validateGroup(courseId, groupId);
    // User user = userRepository.findByEmail(userDetails.getUsername());

    // if (!coreService.hasPermission("list_groups", item.getCourse().getId(),
    // userDetails)
    // && !item.getUsers().contains(user))
    // throw new UserNotAuthorized("User not authorized");

    // return ResponseEntity.ok(item.getUsers());
    // }

    // @PostMapping("{groupId}/users/{userId}")
    // @ApiOperation("Add user to group")
    // public ResponseEntity<Group> addUserToGroup(@PathVariable Long groupId,
    // @PathVariable Long courseId,
    // @PathVariable Long userId, @ApiIgnore @AuthenticationPrincipal UserDetails
    // userDetails) {
    // Group group = coreService.validateGroup(courseId, groupId);
    // User user = coreService.validateUser(userId);

    // if (!coreService.hasPermission("add_user_to_group", courseId, userDetails))
    // throw new UserNotAuthorized("User not authorized");

    // return groupService.addUser(group, user);
    // }

    // @PostMapping("{groupId}/enter")
    // @ApiOperation("Enter group")
    // public ResponseEntity<Group> enterGroup(@PathVariable Long courseId,
    // @PathVariable Long groupId,
    // @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
    // Group group = coreService.validateGroup(courseId, groupId);

    // if (!coreService.hasPermission("enter_group", courseId, userDetails))
    // throw new UserNotAuthorized("User not authorized to enter group.");

    // return groupService.enterGroup(group, userDetails);
    // }

    // @DeleteMapping("{groupId}/users/{userId}")
    // @ApiOperation("Remove user from group")
    // public ResponseEntity<Group> removeUserFromGroup(@PathVariable Long groupId,
    // @PathVariable Long courseId,
    // @PathVariable Long userId, @ApiIgnore @AuthenticationPrincipal UserDetails
    // userDetails) {

    // Group group = coreService.validateGroup(courseId, groupId);
    // User user = coreService.validateUser(userId);

    // if (!coreService.hasPermission("remove_user_from_group", courseId,
    // userDetails))
    // throw new UserNotAuthorized("User not authorized");

    // return groupService.removeUser(group, user);
    // }

    // @DeleteMapping("{groupId}/me")
    // @ApiOperation("Exit from group")
    // public ResponseEntity<Group> exitFromGroup(@PathVariable Long courseId,
    // @PathVariable Long groupId,
    // @PathVariable Long userId, @ApiIgnore @AuthenticationPrincipal UserDetails
    // userDetails) {
    // Group group = coreService.validateGroup(courseId, groupId);
    // User user = userRepository.findByEmail(userDetails.getUsername());

    // if (!coreService.hasPermission("exit_from_group", courseId, userDetails))
    // throw new UserNotAuthorized("User not authorized");

    // return groupService.removeUser(group, user);
    // }

    @PutMapping("{groupId}")
    @ApiOperation("Edit group")
    public ResponseEntity<Group> edit(@RequestBody String name, @PathVariable Long courseId, @PathVariable Long groupId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Group group = coreService.validateGroup(courseId, groupId);

        if (!coreService.hasPermission("edit_group", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }

        return groupService.updateName(name, group);
    }

}