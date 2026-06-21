package com.aritan.ebook_reader.common.advice;

import com.aritan.ebook_reader.common.enums.EBResponseCode;
import com.aritan.ebook_reader.common.exception.*;
import com.aritan.ebook_reader.common.models.EBResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // Not Found
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<EBResponse<Object>> handleNotFoundException(ResourceNotFoundException ex) {
        EBResponse<Object> response = EBResponse.NotFound(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // Duplicate
    @ExceptionHandler(DataDuplicateException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<EBResponse<Object>> handleDuplicateException(DataDuplicateException ex) {
        EBResponse<Object> response = EBResponse.Error(HttpStatus.CONFLICT.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }


    // Invalid
    @ExceptionHandler(DataInvalidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<EBResponse<Object>> handleInvalidException(DataInvalidException ex) {
        EBResponse<Object> response = EBResponse.Error(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Unauthorized
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<EBResponse<Object>> handleAuthenticationException(AuthenticationException ex) {
        EBResponse<Object> response = EBResponse.Unauthorized(HttpStatus.UNAUTHORIZED.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<EBResponse<Object>> handleGenericException(Exception e){
        EBResponse<Object> response = new EBResponse<>(EBResponseCode.Error);
        response.setCodeNumber(HttpStatus.INTERNAL_SERVER_ERROR.value());
        e.printStackTrace();
        response.setMessage(e.getMessage());

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
