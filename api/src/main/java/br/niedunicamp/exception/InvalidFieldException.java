package br.niedunicamp.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(BAD_REQUEST)
public class InvalidFieldException extends RuntimeException {

    private static final long serialVersionUID = 4563660440838847292L;

    public InvalidFieldException() {
        super();
    }
    public InvalidFieldException(String message){
        super(message);
    }
}
