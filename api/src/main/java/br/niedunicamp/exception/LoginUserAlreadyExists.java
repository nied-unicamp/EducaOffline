package br.niedunicamp.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(BAD_REQUEST)
public class LoginUserAlreadyExists extends RuntimeException{
    private static final long serialVersionUID = 5554390557225188697L;

    public LoginUserAlreadyExists() {
        super();
    }
    public LoginUserAlreadyExists(String message){
        super(message);
    }
}
