package com.aritan.ebook_reader.common.models;

import com.aritan.ebook_reader.common.enums.EBResponseCode;
import com.sun.net.httpserver.Authenticator;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class EBResponse<T> {
    private EBResponseCode codeStatus;
    private Integer codeNumber;
    private String message;
    private T data;

    public EBResponse(EBResponseCode codeStatus) {
        this.codeStatus = codeStatus;
        this.message = GetDefaultMessage(codeStatus);
    }

    public static <T> EBResponse<T> Success(T data, String message){
        EBResponse<T> response = new EBResponse<>(EBResponseCode.Success);
        response.setMessage(message);
        response.setCodeNumber(HttpStatus.FOUND.value());
        response.setData(data);

        return response;
    }

    public static <T> EBResponse<Page<T>> Success(Page<T> data, String message){
        EBResponse<Page<T>> response = new EBResponse<>(EBResponseCode.Success);
        response.setMessage(message);
        response.setCodeNumber(HttpStatus.FOUND.value());
        response.setData(data);

        return response;
    }

    public static <T> EBResponse<T> Created(T data, String message){
        EBResponse<T> response = new EBResponse<>(EBResponseCode.Success);
        response.setMessage(message);
        response.setCodeNumber(HttpStatus.CREATED.value());
        response.setData(data);

        return response;
    }

    public static <T> EBResponse<T> Error(Integer codeNumber, String message){
        EBResponse<T> response = new EBResponse<>(EBResponseCode.Error);
        response.setCodeNumber(codeNumber);
        response.setMessage(message);

        return response;
    }

    public static <T> EBResponse<T> Unauthorized(Integer codeNumber, String message){
        EBResponse<T> response = new EBResponse<>(EBResponseCode.Unauthorized);
        response.setCodeNumber(codeNumber);
        response.setMessage(message);

        return response;
    }

    public static <T> EBResponse<T> NotFound(Integer codeNumber, String message){
        EBResponse<T> response = new EBResponse<>(EBResponseCode.NotFound);
        response.setCodeNumber(codeNumber);
        response.setMessage(message);

        return response;
    }

    public static <T> EBResponse<T> Forbidden(Integer codeNumber, String message){
        EBResponse<T> response = new EBResponse<>(EBResponseCode.Forbidden);
        response.setCodeNumber(codeNumber);
        response.setMessage(message);

        return response;
    }

    public static String GetDefaultMessage(EBResponseCode codeStatus){
        return switch (codeStatus) {
            case EBResponseCode.Success -> "Success.";
            case EBResponseCode.Invalid -> "Your information is not valid. Please check and try again.";
            case EBResponseCode.Error -> "Something went wrong.";
            case EBResponseCode.Duplicate -> "The same item is exist.";
            case EBResponseCode.Unauthorized, EBResponseCode.Forbidden ->
                    "You are not authorized to access this resource.";
            case EBResponseCode.Warning -> "Warning.";
            case EBResponseCode.NotFound -> "Item not found.";
        };
    }
}
