package br.niedunicamp.controller;

//#region Imports
import java.util.List;

import javax.validation.Valid;

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
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.FileUploaded;
import br.niedunicamp.pojo.UserPasswordDTO;
import br.niedunicamp.pojo.UserRegistration;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.FileStorageService;
import br.niedunicamp.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;
//#endregion

@CrossOrigin
@Api(value = "UserController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequestMapping("/v1")
public class UserController {

    // #region Repositories
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CoreService coreService;

    @Autowired
    private FileStorageService fileStorageService;
    // #endregion

    @PostMapping("users")
    @ApiOperation("Save user")
    public ResponseEntity<User> saveUser(@Valid @RequestBody UserRegistration user,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return userService.create(user, false);
    }

    @GetMapping("users")
    @ApiOperation("List users")
    public ResponseEntity<List<User>> listUsers(@ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return userService.list(false);
    }

    @PostMapping("admins")
    @ApiOperation("Save admin")
    public ResponseEntity<User> saveAdmin(@Valid @RequestBody UserRegistration user,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return userService.create(user, true);
    }

    @GetMapping("admins")
    @ApiOperation("List admins ")
    public ResponseEntity<List<User>> listAdmins(@ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return userService.list(true);
    }

    @PutMapping("users/{userId}")
    @ApiOperation("Update user")
    public ResponseEntity<User> updateUser(@RequestBody UserRegistration userDTO, @PathVariable Long userId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        User user = coreService.validateUser(userId);

        User me = coreService.validateUser(userDetails);

        // Allow this only for profile owner or admin
        if (me.getId() != user.getId()) {
            coreService.validateAdmin(userDetails);
        }

        return userService.update(userDTO, user);
    }

    @PutMapping("users/{userId}/password")
    @ApiOperation("Update user password")
    public ResponseEntity<User> updateUserPassword(@RequestBody UserPasswordDTO userPasswordDTO,
            @PathVariable Long userId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        User user = coreService.validateUser(userId);

        User me = coreService.validateUser(userDetails);

        // Allow this only for profile owner or admin
        if (me.getId() != user.getId()) {
            coreService.validateAdmin(userDetails);
        }

        return userService.updatePassword(userPasswordDTO, user);
    }

    @PutMapping("me/password")
    @ApiOperation("Update user password")
    public ResponseEntity<User> updateUserPassword(@RequestBody UserPasswordDTO userPasswordDTO,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        User user = coreService.validateUser(userDetails);

        return userService.updatePassword(userPasswordDTO, user);
    }

    @GetMapping(path = { "users/{id}", "admins/{id}" })
    @ApiOperation("Find user by id")
    public ResponseEntity<User> findUserById(@PathVariable Long id) {
        User user = coreService.validateUser(id);

        return userService.find(user);
    }

    @GetMapping("users/email/{email}")
    @ApiOperation("Find student by email")
    public ResponseEntity<User> findUserByName(@PathVariable String email) {
        return userService.findByEmail(email);
    }

    @GetMapping("me")
    @ApiOperation("Find my profile")
    public ResponseEntity<User> currentUserName(@AuthenticationPrincipal UserDetails userDetails) {
        return userService.findByEmail(userDetails.getUsername());
    }

    @PutMapping("me")
    @ApiOperation("Edit my profile")
    public ResponseEntity<User> updateMyProfile(@RequestBody UserRegistration userDTO,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername());

        return userService.update(userDTO, user);
    }

    @PutMapping("users/{userId}/toAdmin")
    @ApiOperation("Turn system user into system admin")
    public ResponseEntity<User> turnUserIntoAdmin(@PathVariable Long userId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        User user = coreService.validateUser(userId);
        coreService.validateAdmin(userDetails);

        return userService.turnUserIntoAdmin(user);
    }

    @DeleteMapping("users/{id}")
    @ApiOperation("Delete user by id")
    public ResponseEntity<?> delete(@PathVariable Long id,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        User user = coreService.validateUser(id);
        coreService.validateAdmin(userDetails);

        return userService.delete(user, false);
    }

    @DeleteMapping("admins/{id}")
    @ApiOperation("Delete admin by id")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        User user = coreService.validateUser(id);
        coreService.validateAdmin(userDetails);

        return userService.delete(user, true);
    }

    /**************************************
     * FILES
     *******************************************/

    @PostMapping("users/{userId}/picture")
    @ApiOperation("Upload user picture")
    public ResponseEntity<List<FileUploaded>> uploadFiles(@RequestParam MultipartFile[] files,
            @PathVariable Long userId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        User profile = coreService.validateUser(userId);
        User user = coreService.validateUser(userDetails);

        if (!user.getIsAdmin() && user.getId() != profile.getId())
            throw new UserNotAuthorized("User not authorized");

        ResponseEntity<List<FileUploaded>> response = fileStorageService.upload(files, profile.getPictureFolder());

        String file = response.getBody().get(0).getFileName();

        profile.setPicture(file);
        userRepository.save(profile);

        return response;
    }

    @GetMapping("users/{userId}/picture")
    @ApiOperation("Get user picture")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long userId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        User profile = coreService.validateUser(userId);

        if (profile.getPicture() == null) {
            throw new ResourceNotFoundException("That user does not have a profile picture.");
        }

        return fileStorageService.download(profile.getPicture(), profile.getFilesFolder());
    }

    @DeleteMapping("users/{userId}/picture")
    @ApiOperation("Delete user picture")
    public ResponseEntity<?> deleteFiles(@PathVariable Long userId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        User profile = coreService.validateUser(userId);
        User user = coreService.validateUser(userDetails);

        if (!user.getIsAdmin() && user.getId() != profile.getId())
            throw new UserNotAuthorized("User not authorized");

        profile.setPicture(null);
        userRepository.save(profile);

        return fileStorageService.deleteFolder(profile, true);
    }
}
