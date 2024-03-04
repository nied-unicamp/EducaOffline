package br.niedunicamp.service.impl;

//#region Imports
import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import antlr.collections.impl.LList;
import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.exception.InvalidFieldException;
import br.niedunicamp.model.Permission;
import br.niedunicamp.model.Role;
import br.niedunicamp.repository.PermissionRepository;
import br.niedunicamp.repository.RoleRepository;
import br.niedunicamp.service.PermissionsService;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.RoleService;
import br.niedunicamp.service.UserService;

//#endregion

// implements RoleService
@Service
public class PermissionsServiceImpl implements PermissionsService {

    @Autowired
    PermissionRepository permissionRepository;

    @Override
    public ResponseEntity<List<Permission>> list() {
        return ResponseEntity.ok((List<Permission>) permissionRepository.findAll());
    }

    @Override
    public ResponseEntity<Permission> find(Long permissionID) {
        return ResponseEntity.ok(permissionRepository.findById(permissionID)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found for this id: " + permissionID)));
    }

    @Override
    public ResponseEntity<Permission> findByName(String name) {
        return ResponseEntity.ok(permissionRepository.findByName(name));

    }

    @Override
    public ResponseEntity<List<Permission>> create(List<String> permissions) {
        if (permissions == null) {
            throw new InvalidFieldException("Permissions list is null");
        }
        if (permissions.isEmpty()) {
            throw new InvalidFieldException("Permissions list is empty");
        }
        for (String permission : permissions) {
            if (permissionRepository.findByName(permission) != null) {
                throw new InvalidFieldException("Permission " + permission + " already exists");
            }
        }

        List<Permission> newPermissions = new ArrayList<>();
        for (String permission : permissions) {
            Permission permissionToAdd = new Permission();
            permissionToAdd.setName(permission);
            newPermissions.add(permissionToAdd);
        }
        permissionRepository.saveAll(newPermissions);
        return ResponseEntity.ok(newPermissions);
    }

    @Override
    public ResponseEntity<List<Permission>> delete(List<String> permissions) {
        if (permissions == null) {
            throw new InvalidFieldException("Permissions list is null");
        }
        if (permissions.isEmpty()) {
            throw new InvalidFieldException("Permissions list is empty");
        }
        for (String permission : permissions) {
            if (permissionRepository.findByName(permission) == null) {
                throw new InvalidFieldException("Permission " + permission + " does not exist");
            }
        }
        List<Permission> permissionsToDelete = new ArrayList<>();
        for (String permission : permissions) {
            permissionsToDelete.add(permissionRepository.findByName(permission));
        }
        permissionRepository.deleteAll(permissionsToDelete);
        return ResponseEntity.ok().body(null);
    }
}