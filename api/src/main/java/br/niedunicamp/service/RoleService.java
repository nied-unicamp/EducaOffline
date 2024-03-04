package br.niedunicamp.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import br.niedunicamp.model.Role;

public interface RoleService {

    ResponseEntity<Role> update(Long roleID, List<String> permissions);

    ResponseEntity<Role> addPermissions(Long roleID, List<String> permissions);

    ResponseEntity<Role> removePermissions(Long roleID, List<String> permissions);

    ResponseEntity<List<Role>> list();

    ResponseEntity<Role> find(Long roleID);

    ResponseEntity<Role> findByName(String name);

}