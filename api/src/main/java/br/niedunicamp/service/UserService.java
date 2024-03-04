package br.niedunicamp.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import br.niedunicamp.model.Registration;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.UserPasswordDTO;
import br.niedunicamp.pojo.UserRegistration;

public interface UserService {

    ResponseEntity<?> delete(User user, Boolean isAdmin);

    ResponseEntity<User> update(UserRegistration newUser, User user);
    
    User update(Long id, User obj);

    ResponseEntity<User> updatePassword(UserPasswordDTO userPasswordDTO, User user);

    ResponseEntity<User> create(UserRegistration userToBeSaved, Boolean isAdmin);

    ResponseEntity<User> create(Registration registration);

    ResponseEntity<List<User>> list(Boolean isAdmin);

    ResponseEntity<User> find(User user);

    ResponseEntity<User> findByEmail(String email);

    ResponseEntity<User> turnUserIntoAdmin(User user);
}