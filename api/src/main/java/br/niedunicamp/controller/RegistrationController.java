package br.niedunicamp.controller;

import java.util.List;

//#region Imports
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Registration;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.RegistrationDTO;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.RegistrationService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;
//#endregion

@CrossOrigin
@Api(value = "RegistrationController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
@RequestMapping("/v1/register")
public class RegistrationController {

    // #region Services
    @Autowired
    private CoreService coreService;

    @Autowired
    private RegistrationService registrationService;
    // #endregion

    @PostMapping("start")
    @ApiOperation("Start an user registration")
    public ResponseEntity<Registration> registerStart(@RequestBody RegistrationDTO registrationDTO) {
        return registrationService.startRegistration(registrationDTO);
    }

    @PostMapping("finish")
    @ApiOperation("Finish an user registration")
    public ResponseEntity<User> registerFinish(@RequestBody RegistrationDTO registrationDTO) {
        Registration registration = coreService.validateRegistration(registrationDTO.getEmail());

        return registrationService.finishRegistration(registration, registrationDTO);
    }

    @PostMapping("forgotPassword")
    @ApiOperation("Forgot password")
    public ResponseEntity<?> forgotPassword(@RequestBody RegistrationDTO registrationDTO) {

        return registrationService.forgotPassword(registrationDTO);
    }

    @PostMapping("redefinePassword")
    @ApiOperation("Redefine forgotten password")
    public ResponseEntity<?> redefinePassword(@RequestBody RegistrationDTO registrationDTO) {
        Registration registration = coreService.validateRegistration(registrationDTO.getEmail());

        return registrationService.changePassword(registration, registrationDTO);
    }

    @GetMapping("pending")
    @ApiOperation("List all pending users")
    public ResponseEntity<List<Registration>> listPending(@ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        User user = coreService.validateUser(userDetails);

        if (!user.getIsAdmin()) {
            throw new UserNotAuthorized();
        }

        return registrationService.listPendingRegistrations();
    }

    @GetMapping("pendingPassword")
    @ApiOperation("List forgotten password requests")
    public ResponseEntity<List<Registration>> listForgotten(
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        User user = coreService.validateUser(userDetails);

        if (!user.getIsAdmin()) {
            throw new UserNotAuthorized();
        }

        return registrationService.listPendingPasswordReset();
    }
}
