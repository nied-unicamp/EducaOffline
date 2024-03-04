package br.niedunicamp.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import br.niedunicamp.model.Permission;

public interface PermissionsService {
    
        ResponseEntity<List<Permission>> list();
    
        ResponseEntity<Permission> find(Long permissionID);
    
        ResponseEntity<Permission> findByName(String name);
    
        ResponseEntity<List<Permission>> create(List<String> permissions);
        
        ResponseEntity<List<Permission>> delete(List<String> permissions);
}
