package br.niedunicamp.exception;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(HttpStatus.LOCKED)
public class CourseException extends RuntimeException{
      public CourseException() {
            super();
      }

      public CourseException(String message){
      super(message);
      }
}
