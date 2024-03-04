package br.niedunicamp.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.niedunicamp.model.Login;

/**
 * LoginService
 */
@Service
public interface LoginService {

    public ResponseEntity<?> login(Login loginObj);
}