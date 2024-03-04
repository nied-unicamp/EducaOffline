package br.niedunicamp.service.impl;

//#region Imports
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.Group;
import br.niedunicamp.repository.CourseRepository;
import br.niedunicamp.repository.GroupRepository;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.GroupService;
//#endregion

@Service
public class GroupServiceImpl implements GroupService {

    // #region Repositories and Services
    @Autowired
    GroupRepository groupRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    CoreService coreService;
    // #endregion

    @Override
    public ResponseEntity<Group> create(Course course) {
        Group group = new Group();
        group.setName("");
        group.setCourse(course);

        return ResponseEntity.ok(groupRepository.save(group));
    }

    @Override
    public ResponseEntity<List<Group>> list(Course course) {

        return ResponseEntity.ok(groupRepository.findByCourse(course));
    }

    @Override
    public ResponseEntity<Group> updateName(String name, Group group) {

        group.setName(name);

        return ResponseEntity.ok(groupRepository.save(group));
    }

    @Override
    public ResponseEntity<?> delete(Group group) {

        groupRepository.delete(group);

        return ResponseEntity.ok(null);
    }

    // @Override
    // public ResponseEntity<Group> addUser(Group group, User user) {

    // if (!coreService.isMember(user.getId(), group.getCourse().getId())) {
    // throw new ResourceNotFoundException("The user does not participate in this
    // course!");
    // }

    // if (!group.getUsers().contains(user)) {
    // List<User> users = group.getUsers();
    // users.add(user);
    // group.setUsers(users);

    // groupRepository.save(group);
    // }

    // return ResponseEntity.ok(group);
    // }

    // @Override
    // public ResponseEntity<Group> removeUser(Group group, User user) {

    // if (group.getUsers().contains(user)) {
    // List<User> users = group.getUsers();
    // users.remove(user);
    // group.setUsers(users);

    // groupRepository.save(group);
    // }

    // return ResponseEntity.ok(group);
    // }

    // @Override
    // public ResponseEntity<Group> enterGroup(Group group, UserDetails userDetails)
    // {
    // User user = userRepository.findByEmail(userDetails.getUsername());

    // if (!coreService.isMember(user.getId(), group.getCourse().getId())) {
    // throw new ResourceNotFoundException("The user does not participate in this
    // course!");
    // }

    // if (!group.getUsers().contains(user)) {
    // List<User> users = group.getUsers();
    // users.add(user);
    // group.setUsers(users);

    // groupRepository.save(group);
    // }

    // return ResponseEntity.ok(group);
    // }

}