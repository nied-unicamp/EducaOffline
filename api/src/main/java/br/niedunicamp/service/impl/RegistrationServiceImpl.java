package br.niedunicamp.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Registration;
import br.niedunicamp.model.User;
import br.niedunicamp.model.enums.Language;
import br.niedunicamp.pojo.RegistrationDTO;
import br.niedunicamp.repository.RegistrationRepository;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.EmailService;
import br.niedunicamp.service.RegistrationService;
import br.niedunicamp.service.UserService;
import net.bytebuddy.utility.RandomString;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    private final Long minutesToExpire = Long.valueOf(20);

    // #region Repos and services
    @Autowired
    RegistrationRepository registrationRepository;

    @Autowired
    UserService userService;

    @Autowired
    EmailService emailService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    UserRepository userRepository;
    // #endregion

    @Override
    public ResponseEntity<List<Registration>> listPendingRegistrations() {

        return ResponseEntity.ok(registrationRepository.findByForgotPasswordFalse());
    }

    @Override
    public ResponseEntity<List<Registration>> listPendingPasswordReset() {

        return ResponseEntity.ok(registrationRepository.findByForgotPasswordTrue());
    }

    @Override
    public ResponseEntity<Registration> startRegistration(RegistrationDTO registrationDTO) {
        User user = userRepository.findByEmail(registrationDTO.getEmail());

        if (user instanceof User) {
            throw new UserNotAuthorized("This email is already registered");
        }

        if (registrationDTO.getPassword() == null || registrationDTO.getPassword().length() < 8) {
            throw new UserNotAuthorized("Password too short");
        }

        Registration registration = new Registration();
        registration.setEmail(registrationDTO.getEmail());
        registration.setName(registrationDTO.getName());
        registration.setPassword(registrationDTO.getPassword());
        registration.setLanguage(Language.valueOf(registrationDTO.getLanguage()));

        registration.setDate(new Date());
        registration.setHash(RandomString.make(6));

        registration = registrationRepository.save(registration);

        this.sendEmailRegistration(registration);

        return ResponseEntity.ok(registration);
    }

    @Override
    public ResponseEntity<User> finishRegistration(Registration registration, RegistrationDTO registrationDTO) {

        Date maxDate = new Date(registration.getDate().getTime() + this.minutesToExpire * 60 * 1000);

        if (maxDate.before(new Date())) {
            registrationRepository.delete(registration);

            throw new UserNotAuthorized("Registration expired");
        }

        if (!registration.getHash().contentEquals(registrationDTO.getHash())) {

            throw new UserNotAuthorized("Invalid hash");
        }

        User user = this.userService.create(registration).getBody();
        registrationRepository.delete(registration);

        return ResponseEntity.ok(user);
    }

    @Override
    public ResponseEntity<?> forgotPassword(RegistrationDTO registrationDTO) {
        User user = userRepository.findByEmail(registrationDTO.getEmail());

        if (user == null) {
            throw new ResourceNotFoundException("E-mail not found.");
        }

        Registration registration = new Registration();
        registration.setName(user.getName());
        registration.setEmail(user.getEmail());
        registration.setDate(new Date());
        registration.setHash(RandomString.make(6));
        registration.setForgotPassword(true);

        registration = registrationRepository.save(registration);
        this.sendEmailForgotPassword(registration);

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<?> changePassword(Registration registration, RegistrationDTO registrationDTO) {
        if (!registration.getHash().contentEquals(registrationDTO.getHash())) {
            throw new UserNotAuthorized("Invalid hash");
        }

        User user = userRepository.findByEmail(registration.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));

        userRepository.save(user);
        registrationRepository.delete(registration);

        return ResponseEntity.ok(null);
    }

    private void sendEmailForgotPassword(Registration registration) {

        String subject = "Redefinição de sua senha do Core";

        String body = "Foi solicitada a redefinição de senha para o seu email (" + registration.getEmail()
                + ")\n\n\n Acesse o endereço abaixo para alterar a sua senha: \n\n\n" + forgotLink(registration);

        // TODO: treat email errors
        this.emailService.sendSimpleMessage(registration.getEmail(), subject, body);
    }

    private void sendEmailRegistration(Registration registration) {

        String subject = "Criar conta no ambiente Core";

        String body = "Você iniciou a criação de conta no ambiente EAD Core para o seu email ("
                + registration.getEmail() + ")\n\n\n Acesse o endereço abaixo para concluir o seu cadastro: \n\n\n"
                + registerLink(registration);

        // TODO: treat email errors
        this.emailService.sendSimpleMessage(registration.getEmail(), subject, body);
    }

    private String forgotLink(Registration registration) {
        return forgotLink("https://proteo.nied.unicamp.br/prod/", registration);
    }

    private String registerLink(Registration registration) {
        return registerLink("https://proteo.nied.unicamp.br/prod/", registration);
    }

    private String forgotLink(String baseUrl, Registration registration) {
        return baseUrl + "login/changePassword?email=" + registration.getEmail() + "&hash=" + registration.getHash();
    }

    private String registerLink(String baseUrl, Registration registration) {
        return baseUrl + "register/finish?email=" + registration.getEmail() + "&hash=" + registration.getHash();
    }
}