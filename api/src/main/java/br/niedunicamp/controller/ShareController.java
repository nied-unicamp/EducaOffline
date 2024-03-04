package br.niedunicamp.controller;


//#region Imports
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
import br.niedunicamp.model.Share;
import br.niedunicamp.model.User;
import br.niedunicamp.service.CoreService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;
//#endregion

@CrossOrigin
@Api(value = "ShareController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequestMapping("/v1")
public class ShareController {

    // @Autowired
    // private ShareService shareService;

    @Autowired
    private CoreService coreService;

    // @Autowired
    // private ShareService shareService;

    // GET (Tool)
    // courses/{courseId}/activities/shared
    // courses/{courseId}/material/shared

    // GET, POST, PUT, DELETE (Share)
    // courses/{courseId}/activities/{activityId}/sharing
    // courses/{courseId}/material/{materialId}/sharing

    /*
     * @GetMapping("courses/{courseId}/shared")
     *
     * @ApiOperation(value = "List shared activities", response =
     * ResponseEntity.class) public ResponseEntity<?> list(@PathVariable Long
     * courseId,
     *
     * @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
     *
     * if (coreService.hasPermission("list_shared", courseId, userDetails)) { return
     * shareService.listAll(courseId); } else { throw new UserNotAuthorized(
     * "User not authorized: " +
     * userRepository.findByEmail(userDetails.getUsername()).getName()); } }
     */

    @GetMapping("courses/{courseId}/shares/{shareId}")
    @ApiOperation("Get share")
    public ResponseEntity<Share> get(@PathVariable Long shareId, @PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Share share = coreService.validateShare(courseId, shareId);
        User user = coreService.validateUser(userDetails);

        if (!coreService.hasPermission("list_shares", courseId, userDetails)
                && !share.getUsers().contains(user))
            throw new UserNotAuthorized("User not authorized");

        return ResponseEntity.ok(share);
    }

    /*
     * @GetMapping("courses/{courseId}/shares/{shareId}/users/")
     *
     * @ApiOperation("Get share") public
     * ResponseEntity<List<User>> getUsers(@PathVariable Long shareId, @PathVariable
     * Long courseId,
     *
     * @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) { Share item =
     * shareRepository.findById(shareId).orElseGet(null);
     *
     * if (item == null || item.getCourse().getId() != courseId) { throw new
     * ResourceNotFoundException("This share id=" + shareId +
     * " is not present in this course."); }
     *
     * User user = userRepository.findByEmail(userDetails.getUsername());
     *
     * String permissionName = new String("list_shares"); if
     * (!coreService.hasPermission(permissionName, item.getCourse().getId(),
     * userDetails) && !item.getUsers().contains(user)) throw new
     * UserNotAuthorized("User not authorized");
     *
     * return ResponseEntity.ok(new ArrayList<>(item.getUsers())); }
     */

    /*
     * @PostMapping("courses/{courseId}/shares/{shareId}/users/{userId}")
     *
     * @ApiOperation("Add user to share")
     * public ResponseEntity<Share> addUserToShare(@PathVariable Long
     * shareId, @PathVariable Long courseId,
     *
     * @PathVariable Long userId, @ApiIgnore @AuthenticationPrincipal UserDetails
     * userDetails) { Share item = shareRepository.findById(shareId).orElseGet(null);
     *
     * if (item == null || item.getCourse().getId() != courseId) { throw new
     * ResourceNotFoundException("This share id=" + shareId +
     * " is not present in this course."); }
     *
     * User user = userRepository.findById(userId).orElseGet(null);
     *
     * if (user == null) { throw new ResourceNotFoundException("User not found"); }
     *
     * String permissionName = new String("add_any_user_to_share"); String
     * permissionName2 = new String("enter_share"); if
     * (!coreService.hasPermission(permissionName, courseId, userDetails) &&
     * !(coreService.hasPermission(permissionName2, courseId, userDetails) &&
     * user.getEmail() == userDetails.getUsername())) throw new
     * UserNotAuthorized("User not authorized");
     *
     * return shareService.addUser(shareId, user); }
     */

    /*
     * @DeleteMapping("courses/{courseId}/shares/{shareId}/users/{userId}")
     *
     * @ApiOperation(value = "Remove user from share", response =
     * ResponseEntity.class) public ResponseEntity<Share>
     * removeUserFromShare(@PathVariable Long shareId, @PathVariable Long courseId,
     *
     * @PathVariable Long userId, @ApiIgnore @AuthenticationPrincipal UserDetails
     * userDetails) { Share item = shareRepository.findById(shareId).orElseGet(null);
     *
     * if (item == null || item.getCourse().getId() != courseId) { throw new
     * ResourceNotFoundException("This share id=" + shareId +
     * " is not present in this course."); }
     *
     * User user = userRepository.findById(userId).orElseGet(null);
     *
     * if (user == null) { throw new ResourceNotFoundException("User not found"); }
     *
     * String permissionName = new String("remove_any_user_from_share"); String
     * permissionName2 = new String("leave_share"); if
     * (!coreService.hasPermission(permissionName, courseId, userDetails) &&
     * !(coreService.hasPermission(permissionName2, courseId, userDetails) &&
     * user.getEmail() == userDetails.getUsername())) throw new
     * UserNotAuthorized("User not authorized");
     *
     * return shareService.removeUser(shareId, user); }
     */

}