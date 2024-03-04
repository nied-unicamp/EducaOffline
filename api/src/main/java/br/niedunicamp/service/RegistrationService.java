package br.niedunicamp.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import br.niedunicamp.model.Registration;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.RegistrationDTO;

public interface RegistrationService {

    ResponseEntity<List<Registration>> listPendingRegistrations();

    ResponseEntity<List<Registration>> listPendingPasswordReset();

    ResponseEntity<Registration> startRegistration(RegistrationDTO registrationDTO);

    ResponseEntity<User> finishRegistration(Registration registration, RegistrationDTO registrationDTO);

    ResponseEntity<?> forgotPassword(RegistrationDTO registrationDTO);

    ResponseEntity<?> changePassword(Registration registration, RegistrationDTO registrationDTO);
}