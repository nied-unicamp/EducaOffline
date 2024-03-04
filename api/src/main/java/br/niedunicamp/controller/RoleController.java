package br.niedunicamp.controller;

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

import br.niedunicamp.model.Role;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.RoleService;

@CrossOrigin
@Api(value = "RoleController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
@RequestMapping("/v1")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @Autowired
    private CoreService coreService;

    @PutMapping("roles/update/{roleID}")
    @ApiOperation("Update role")
    public ResponseEntity<Role> update(@PathVariable Long roleID, @RequestBody List<String> permissions, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return roleService.update(roleID, permissions);
    }

    @PutMapping("roles/add/{roleID}")
    @ApiOperation("Add permissions to role")
    public ResponseEntity<Role> addPermissions(@PathVariable Long roleID, @RequestBody List<String> permissions, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return roleService.addPermissions(roleID, permissions);
    }
    
    @PutMapping("roles/remove/{roleID}")
    @ApiOperation("Remove permissions from role")
    public ResponseEntity<Role> removePermissions(@PathVariable Long roleID, @RequestBody List<String> permissions, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return roleService.removePermissions(roleID, permissions);
    }

    @GetMapping("roles")
    @ApiOperation("List roles")
    public ResponseEntity<List<Role>> list(@ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return roleService.list();
    }

    @GetMapping("roles/{roleID}")
    @ApiOperation("Find role by ID")
    public ResponseEntity<Role> find(@PathVariable Long roleID, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return roleService.find(roleID);
    }

    @GetMapping("roles/names/{name}")
    @ApiOperation("Find role by name")
    public ResponseEntity<Role> findByName(@PathVariable String name, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        coreService.validateAdmin(userDetails);

        return roleService.findByName(name);
    }



}
