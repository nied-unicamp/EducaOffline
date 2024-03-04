package br.niedunicamp.service.impl;

import java.util.Arrays;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import br.niedunicamp.exception.InvalidFieldException;
import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.model.Login;
import br.niedunicamp.model.User;
import br.niedunicamp.model.enums.Language;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.LoginService;
import br.niedunicamp.service.UserService;

/**
 * LoginService
 */
@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    UserRepository userRepository;
    
    @Autowired
    UserService userService;

    @Value("${app.security.client-secret}")
    private String clientSecret;

    @Value("${app.security.client-id}")
    private String clientId;

    @Value("${host.full.dns.auth.link}")
    String baseUrl;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public ResponseEntity<?> login(Login loginObj) {

        if (loginObj == null || loginObj.getUserEmail() == null) {
            throw new InvalidFieldException("Missing email.");
        }

        // if user was already register, already is in databse
        User user = userRepository.findByEmail(loginObj.getUserEmail());

        if (user == null) {
            throw new ResourceNotFoundException("Email not registrated");
        }

        // verify if the password matches with the one in database
        if (!passwordEncoder.matches(loginObj.getPassword(), user.getPassword())) {
            if (loginObj.getPassword().length() < 8) {
                throw new InvalidFieldException("Password can not have less than 8 digits.");
            } else {
                throw new ResourceNotFoundException("Password invalid for login: " + loginObj.getUserEmail());
            }
        }
        
        try {
        	Language.valueOf(loginObj.getLanguage());
        }catch (Exception e) {
        	if(loginObj.getLanguage() != null) {
        		loginObj.setLanguage(Language.getLanguageDefault());
        	}
        }
        /*
        //verifica se a lingua passada no login é igual a lingua salva no banco de dados
        if(loginObj.getLanguage()!= null && user.getLanguage() != Language.valueOf(loginObj.getLanguage())) {
        	User usuario = new User();
        	usuario = user;
        	usuario.setLanguage(Language.valueOf(loginObj.getLanguage()));
        	try {
        		this.userService.update(user.getId(), usuario);
        	} catch(Exception e) {
        		System.out.println(e.getMessage());
        	}
        }
        */
        return getToken(loginObj.getUserEmail(), loginObj.getPassword());
    }

    private ResponseEntity<?> getToken(String login, String pw) {
        RestTemplate restTemplate = new RestTemplate();

        // According OAuth documentation we need to send the client id and secret key in
        // the header for authentication

        String credentials = clientId + ":" + clientSecret;
        String encodedCredentials = new String(Base64.getEncoder().encodeToString(credentials.getBytes()));

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.add("Authorization", "Basic " + encodedCredentials);

        HttpEntity<String> request = new HttpEntity<String>(headers);

        String access_token_url = baseUrl + "/oauth/token";
        access_token_url += "?grant_type=password";
        access_token_url += "&username=" + login + "&password=" + pw;
        
        
        
        return restTemplate.exchange(access_token_url, HttpMethod.POST, request, String.class);
    }
}