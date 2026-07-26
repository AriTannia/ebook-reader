package com.aritan.ebook_reader.common.advice;

import com.aritan.ebook_reader.common.enums.EBResponseCode;
import com.aritan.ebook_reader.common.exception.*;
import com.aritan.ebook_reader.common.models.EBResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;

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

    // Unauthorized
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<EBResponse<Object>> handleAuthenticationException(AuthenticationException ex) {
        EBResponse<Object> response = EBResponse.Unauthorized(HttpStatus.UNAUTHORIZED.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<EBResponse<Object>> handleGenericException(Exception e) {
        EBResponse<Object> response = new EBResponse<>(EBResponseCode.Error);
        response.setCodeNumber(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setMessage(e.getMessage());

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler({
            org.springframework.security.access.AccessDeniedException.class,
            com.aritan.ebook_reader.common.exception.AccessDeniedException.class
    })
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<EBResponse<Object>> handleForbiddenException(Exception e) {
        EBResponse<Object> response = EBResponse.Forbidden(HttpStatus.FORBIDDEN.value(), e.getMessage());
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(InvalidRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<EBResponse<Object>> handleInvalidException(InvalidRequestException e){
        EBResponse<Object> response = EBResponse.Error(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<EBResponse<Map<String, String>>> handleMethodValidationExceptions(MethodArgumentNotValidException ex) {
        EBResponse<Map<String, String>> response = new EBResponse<>(EBResponseCode.Error);
        response.setCodeNumber(HttpStatus.BAD_REQUEST.value());

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        response.setData(errors);
        response.setMessage(ex.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<EBResponse<Object>> handleValidationExceptions(ValidationException ex) {
        EBResponse<Object> response = EBResponse.Error(HttpStatus.CONFLICT.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<EBResponse<Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = String.format("Invalid value for parameter '%s'", ex.getName());
        EBResponse<Object> response = EBResponse.Error(HttpStatus.BAD_REQUEST.value(), message);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
