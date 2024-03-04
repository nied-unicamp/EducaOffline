package br.niedunicamp.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.Group;

/**
 * GroupService
 */
@Service
public interface GroupService {
    ResponseEntity<Group> create(Course course);

    ResponseEntity<List<Group>> list(Course course);

    ResponseEntity<Group> updateName(String name, Group group);

    ResponseEntity<?> delete(Group group);

    // ResponseEntity<Group> addUser(Group group, User user);

    // ResponseEntity<Group> enterGroup(Group group, UserDetails userDetails);

    // ResponseEntity<Group> removeUser(Group group, User user);
}