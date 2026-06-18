package com.aritan.ebook_reader.common.exception;

import com.aritan.ebook_reader.common.enums.EBResponseCode;
import com.aritan.ebook_reader.common.models.EBResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // Not Found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<EBResponse<Object>> handleNotFoundException(ResourceNotFoundException ex) {
        EBResponse<Object> response = EBResponse.Error(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // Duplicate
    @ExceptionHandler(DataDuplicateException.class)
    public ResponseEntity<EBResponse<Object>> handleDuplicateException(DataDuplicateException ex) {
        EBResponse<Object> response = EBResponse.Error(HttpStatus.CONFLICT.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }


    // Invalid
    @ExceptionHandler(DataInvalidException.class)
    public ResponseEntity<EBResponse<Object>> handleInvalidException(DataInvalidException ex) {
        EBResponse<Object> response = EBResponse.Error(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Unauthorized
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<EBResponse<Object>> handleUnauthorizedException(UnauthorizedException ex) {
        EBResponse<Object> response = EBResponse.Error(HttpStatus.UNAUTHORIZED.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    // Forbidden
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<EBResponse<Object>> handleForbiddenException(ForbiddenException ex) {
        EBResponse<Object> response = EBResponse.Error(HttpStatus.FORBIDDEN.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<EBResponse<Object>> handleGenericException(Exception e){
        EBResponse<Object> response = new EBResponse<>(EBResponseCode.Error);
        response.setCodeNumber(HttpStatus.INTERNAL_SERVER_ERROR.value());

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
