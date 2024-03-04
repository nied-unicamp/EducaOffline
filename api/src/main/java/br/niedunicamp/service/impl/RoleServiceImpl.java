package br.niedunicamp.service.impl;

//#region Imports
import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.exception.InvalidFieldException;
import br.niedunicamp.model.Role;
import br.niedunicamp.model.Permission;
import br.niedunicamp.repository.RoleRepository;
import br.niedunicamp.repository.PermissionRepository;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.RoleService;
import br.niedunicamp.service.UserService;
import br.niedunicamp.util.DateUtil;
import net.bytebuddy.utility.RandomString;
//#endregion

// implements RoleService
@Service
public class RoleServiceImpl implements RoleService {

    // #region Repositories and Services
    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PermissionRepository permissionRepository;

    // #endregion

    @Override
    public ResponseEntity<Role> update(Long roleID, List<String> permissions) {
        Role roleToBeUpdated = roleRepository.findById(roleID)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found for this id: " + roleID));
        if (permissions == null) {
            throw new InvalidFieldException("Permissions list is null");
        }
        if (permissions.isEmpty()) {
            throw new InvalidFieldException("Permissions list is empty");
        }

        for (String permission : permissions) {
            if (permissionRepository.findByName(permission) == null) {
                throw new InvalidFieldException("Permission " + permission + " is invalid");
            }
        }
        List<Permission> newPermissions = new ArrayList<>();
        for (String permission : permissions) {
            newPermissions.add(permissionRepository.findByName(permission));
        }
        roleToBeUpdated.setPermissions(newPermissions);

        return ResponseEntity.ok(roleRepository.save(roleToBeUpdated));
    }

    @Override
    public ResponseEntity<Role> addPermissions(Long roleID, List<String> permissions) {

        Role roleToBeUpdated = roleRepository.findById(roleID)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found for this id: " + roleID));
        if (permissions == null) {
            throw new InvalidFieldException("Permissions list is null");
        }
        if (permissions.isEmpty()) {
            throw new InvalidFieldException("Permissions list is empty");
        }

        for (String permission : permissions) {
            if (permissionRepository.findByName(permission) == null) {
                throw new InvalidFieldException("Permission " + permission + " is invalid");
            }
        }
        for (String permission : permissions) {
            if (roleToBeUpdated.getPermissions().contains(permissionRepository.findByName(permission))) {
                throw new InvalidFieldException("Permission " + permission + " already exists");
            }
            roleToBeUpdated.getPermissions().add(permissionRepository.findByName(permission));
        }

        return ResponseEntity.ok(roleRepository.save(roleToBeUpdated));
    }

    @Override
    public ResponseEntity<Role> removePermissions(Long roleID, List<String> permissions) {
        
        Role roleToBeUpdated = roleRepository.findById(roleID)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found for this id: " + roleID));
        if (permissions == null) {
            throw new InvalidFieldException("Permissions list is null");
        }

        if (permissions.isEmpty()) {
            throw new InvalidFieldException("Permissions list is empty");
        }

        for (String permission : permissions) {
            if (permissionRepository.findByName(permission) == null) {
                throw new InvalidFieldException("Permission " + permission + " is invalid");
            }
        }

        for (String permission : permissions) {
            roleToBeUpdated.getPermissions().remove(permissionRepository.findByName(permission));
        }
        return ResponseEntity.ok(roleRepository.save(roleToBeUpdated));
    }

    @Override
    public ResponseEntity<List<Role>> list() {
        return ResponseEntity.ok((List<Role>) roleRepository.findAll());
    }

    @Override
    public ResponseEntity<Role> find(Long roleID) {
        return ResponseEntity.ok(roleRepository.findById(roleID)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found for this id: " + roleID)));
    }

    @Override
    public ResponseEntity<Role> findByName(String name) {
        return ResponseEntity.ok(roleRepository.findByName(name));
    }

}