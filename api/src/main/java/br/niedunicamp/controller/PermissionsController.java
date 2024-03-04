package br.niedunicamp.controller;

import java.security.Permissions;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

import br.niedunicamp.model.Permission;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.PermissionsService;

@CrossOrigin
@Api(value = "PermissionsController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
@RequestMapping("/v1")
public class PermissionsController {

    @Autowired
    private PermissionsService permissionService;

    @Autowired
    private CoreService coreService;

    @GetMapping("permissions/list")
    @ApiOperation("List all permissions")
    public ResponseEntity<List<Permission>> list(@ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return permissionService.list();
    }

    @GetMapping("permissions/findByID/{permissionID}")
    @ApiOperation("Find permission by ID")
    public ResponseEntity<Permission> find(@PathVariable Long permissionID, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return permissionService.find(permissionID);
    }

    @GetMapping("permissions/findByName/{name}")
    @ApiOperation("Find permission by name")
    public ResponseEntity<Permission> findByName(@PathVariable String name, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return permissionService.findByName(name);
    }

    @PutMapping("permissions/create")
    @ApiOperation("Create permissions")
    public ResponseEntity<List<Permission>> create(@RequestBody List<String> permissions, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return permissionService.create(permissions);
    }

    @PutMapping("permissions/delete")
    @ApiOperation("Delete permissions")
    public ResponseEntity<List<Permission>> delete(@RequestBody List<String> permissions, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return permissionService.delete(permissions);
    } 

}

