package com.aritan.ebook_reader.common.advice;

import com.aritan.ebook_reader.common.exception.TokenException;
import com.aritan.ebook_reader.common.exception.TooManyRequestsException;
import com.aritan.ebook_reader.common.models.EBResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TooManyListenersException;

@RestControllerAdvice
public class TokenExceptionHandler {
    @ExceptionHandler(TokenException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<EBResponse<Object>> handleTokenException(
            TokenException ex, WebRequest request) {
        EBResponse<Object> response =
                EBResponse.Forbidden(HttpStatus.BAD_REQUEST.value(), ex.getMessage());

        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("description", request.getDescription(false));
        errorDetails.put("timestamp", new Date());
        response.setData(errorDetails);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TooManyRequestsException.class)
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    public ResponseEntity<EBResponse<Object>> handleTooManyRequests(TooManyListenersException ex){
        EBResponse<Object> response = EBResponse.Error(HttpStatus.TOO_MANY_REQUESTS.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.TOO_MANY_REQUESTS);
    }
}
