package com.aritan.ebook_reader.features.auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseCookie;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserJwtHeaderResponse {
    private ResponseCookie jwtCookie;
    private ResponseCookie jwtRefreshCookie;
}
