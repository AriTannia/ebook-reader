package com.aritan.ebook_reader.features.auth;

import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.auth.dtos.*;
import com.aritan.ebook_reader.features.user.dtos.UserResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseCookie;

public interface IAuthService {
    UserAuthenticationResponse authenticateUser(@Valid LoginRequest request);

    UserResponse registerUser(@Valid SignupRequest request);

    UserJwtHeaderResponse signOutUser();

    ResponseCookie refreshToken(HttpServletRequest request);
    User getCurrentUser();

    UserResponse getCurrentUserFromCookie(HttpServletRequest request);
}
