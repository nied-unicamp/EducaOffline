package br.niedunicamp.service.impl;

//#region Imports
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.niedunicamp.exception.InvalidFieldException;
import br.niedunicamp.exception.LoginUserAlreadyExists;
import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Registration;
import br.niedunicamp.model.User;
import br.niedunicamp.model.enums.Language;
import br.niedunicamp.pojo.UserPasswordDTO;
import br.niedunicamp.pojo.UserRegistration;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.UserService;
//#endregion

@Service
public class UserServiceImpl implements UserService {

    //#region Repos and Services
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;
    //#endregion

    @Override
    public ResponseEntity<User> create(UserRegistration userToBeSaved, Boolean isAdmin) {
        return ResponseEntity.ok(this.create(userToBeSaved.getName(), userToBeSaved.getEmail(), userToBeSaved.getPassword(), isAdmin, userToBeSaved.getLanguage()));
    }

    @Override
    public ResponseEntity<User> create(Registration registration) {
        return ResponseEntity.ok(this.create(registration.getName(), registration.getEmail(), registration.getPassword(), false, registration.getLanguage().toString()));
    }

    private User create(String name, String email, String password, Boolean isAdmin, String language) {

        if (emailUsed(email)) {
            throw new LoginUserAlreadyExists("Email already in use: " + email);
        }

        if (password == null || password.length() < 6) {
            throw new InvalidFieldException("Password Missing or too short");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setIsAdmin(isAdmin);
        user.setLanguage(Language.valueOf(language));

        return userRepository.save(user);
    }

    @Override
    public ResponseEntity<?> delete(User user, Boolean isAdmin) {

        userRepository.delete(user);
        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<User> update(UserRegistration newUser, User user) {

        if (newUser.getAboutMe() != null) {
            user.setAboutMe(newUser.getAboutMe());
        }

        if (newUser.getName() != null) {
            user.setName(newUser.getName());
        }

        if (newUser.getLanguage() != null) {
            user.setLanguage(Language.valueOf(newUser.getLanguage()));
        }

        return ResponseEntity.ok(userRepository.save(user));
    }
    
    @Override
    public User update(Long id, User obj) {
		try {
			Optional<User> entity = userRepository.findById(id);
			updateData(entity.get(), obj);
			return userRepository.save(entity.get());
		} catch (ResourceNotFoundException e) {
			throw new ResourceNotFoundException(e.getMessage());
		}
	}
    
    private void updateData(User entity, User obj) {
		entity.setLanguage(obj.getLanguage());
	}

    @Override
    public ResponseEntity<List<User>> list(Boolean isAdmin) {

        return ResponseEntity.ok(userRepository.findByIsAdmin(isAdmin));
    }

    @Override
    public ResponseEntity<User> find(User user) {
        return ResponseEntity.ok(user);
    }

    @Override
    public ResponseEntity<User> findByEmail(String email) {

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with email: " + email);
        }

        return ResponseEntity.ok(user);

    }

    private boolean emailUsed(String email) {
        return userRepository.findByEmail(email) != null;
    }

    @Override
    public ResponseEntity<User> turnUserIntoAdmin(User user) {
        user.setIsAdmin(true);

        return ResponseEntity.ok(userRepository.save(user));
    }

    @Override
    public ResponseEntity<User> updatePassword(UserPasswordDTO userPasswordDTO, User user) {
        Boolean passwordMatches = passwordEncoder.matches(userPasswordDTO.getOldPassword(), user.getPassword());

        if (!passwordMatches) {
            throw new UserNotAuthorized("Current password do not match.");
        }

        String encodedPassword = passwordEncoder.encode(userPasswordDTO.getNewPassword());

        user.setPassword(encodedPassword);

        return ResponseEntity.ok(userRepository.save(user));
    }
}