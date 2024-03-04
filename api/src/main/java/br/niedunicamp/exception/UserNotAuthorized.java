package br.niedunicamp.exception;

import static org.springframework.http.HttpStatus.FORBIDDEN;

import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(FORBIDDEN)
public class UserNotAuthorized extends RuntimeException{

    private static final long serialVersionUID = 3234550561389001495L;

    public UserNotAuthorized() {
        super();
    }
    public UserNotAuthorized(String message){
        super(message);
    }
}
