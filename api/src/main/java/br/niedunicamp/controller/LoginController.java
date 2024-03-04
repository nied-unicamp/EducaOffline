package br.niedunicamp.controller;

//#region Imports
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.niedunicamp.model.Login;
import br.niedunicamp.service.LoginService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
//#endregion

@CrossOrigin
@Api(value = "LoginController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequestMapping("/v1")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping(value = "login")
    @ApiOperation("Login a user")
    public ResponseEntity<?> login(@RequestBody Login login) {
        ResponseEntity<?> res = loginService.login(login);
        
        return ResponseEntity.ok(res.getBody());
    }

    @PostMapping(value = "connection")
    @ApiOperation("Get internet connection status")
    public ResponseEntity<Integer> getConnectionStatus(@RequestBody int number) {
        return ResponseEntity.ok(number);
    }
}
