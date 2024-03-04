package br.niedunicamp.exception;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class HandlerControllerAdviceException {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    public @ResponseBody ResponseException handleResourceNotFound(final ResourceNotFoundException exception,
            final HttpServletRequest request) {

        ResponseException error = new ResponseException();
        error.setErrorMessage(exception.getMessage());
        error.callerURL(request.getRequestURI());
        error.setCode(HttpStatus.NOT_FOUND.toString());

        return error;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    public @ResponseBody ResponseException handleInternalServerException(final Exception exception,
            final HttpServletRequest request) {

        ResponseException error = new ResponseException();
        error.setErrorMessage(exception.getMessage());
        error.callerURL(request.getRequestURI());
        error.setCode(HttpStatus.INTERNAL_SERVER_ERROR.toString());

        return error;
    }

    @ExceptionHandler(UserNotAuthorized.class)
    @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
    public @ResponseBody ResponseException handleUnauthorizedException(final Exception exception,
            final HttpServletRequest request) {

        ResponseException error = new ResponseException();
        error.setErrorMessage(exception.getMessage());
        error.callerURL(request.getRequestURI());
        error.setCode(HttpStatus.UNAUTHORIZED.toString());
        return error;
    }

    @ExceptionHandler(InvalidFieldException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public @ResponseBody ResponseException handleInvalidFieldException(final Exception exception,
            final HttpServletRequest request) {

        ResponseException error = new ResponseException();
        error.setErrorMessage(exception.getMessage());
        error.callerURL(request.getRequestURI());
        error.setCode(HttpStatus.BAD_REQUEST.toString());
        return error;
    }

    @ExceptionHandler(LoginUserAlreadyExists.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public @ResponseBody ResponseException handleLoginUserAlreadyExists(final Exception exception,
            final HttpServletRequest request) {

        ResponseException error = new ResponseException();
        error.setErrorMessage(exception.getMessage());
        error.callerURL(request.getRequestURI());
        error.setCode(HttpStatus.BAD_REQUEST.toString());
        return error;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}
