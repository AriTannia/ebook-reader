package com.aritan.ebook_reader.common.advice;

import com.aritan.ebook_reader.common.models.EBResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class UnsupportedOperationHandler {
    @ExceptionHandler(UnsupportedOperationException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public ResponseEntity<EBResponse<Object>> handleUnsupportedOperationException(UnsupportedOperationException ex) {
        EBResponse<Object> response = EBResponse.Error(HttpStatus.METHOD_NOT_ALLOWED.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.METHOD_NOT_ALLOWED);
    }
}
