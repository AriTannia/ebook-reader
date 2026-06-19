package com.aritan.ebook_reader.features.auth;

import com.aritan.ebook_reader.common.models.User;
import com.aritan.ebook_reader.features.auth.dtos.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseCookie;

public interface IAuthService {
    UserAuthenticationResponse authenticateUser(@Valid LoginRequest request);

    User registerUser(@Valid SignupRequest request);

    UserJwtHeaderResponse signOutUser();

    ResponseCookie refreshToken(HttpServletRequest request);
}
