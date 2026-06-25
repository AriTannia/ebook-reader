package com.aritan.ebook_reader.features.auth;

import com.aritan.ebook_reader.common.constants.messages.AuthMessage;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.auth.dtos.LoginRequest;
import com.aritan.ebook_reader.features.auth.dtos.SignupRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final IAuthService authService;
    @PostMapping("/signin")
    public ResponseEntity<EBResponse<?>> signInUser(@Valid @RequestBody LoginRequest request){
        var result = authService.authenticateUser(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, result.getUserJwtHeaderResponse().getJwtCookie().toString())
                .header(HttpHeaders.SET_COOKIE, result.getUserJwtHeaderResponse().getJwtRefreshCookie().toString())
                .body(EBResponse.Success(result.getUserAuthResponse(), AuthMessage.SIGN_IN_SUCCESSFUL));
    }

    @PostMapping("/signup")
    public ResponseEntity<EBResponse<?>> signUpUser(@Valid @RequestBody SignupRequest request){
        var result = authService.registerUser(request);
        return ResponseEntity.ok(EBResponse.Success(result, AuthMessage.SIGN_UP_SUCCESSFUL));
    }

    @PostMapping("/signout")
    public ResponseEntity<EBResponse<?>> signOutUser(){
        var result = authService.signOutUser();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, result.getJwtCookie().toString())
                .header(HttpHeaders.SET_COOKIE, result.getJwtRefreshCookie().toString())
                .body(EBResponse.Success(null, AuthMessage.SIGN_OUT_SUCCESSFUL));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<EBResponse<?>> refreshToken(HttpServletRequest request){
        var result = authService.refreshToken(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, result.toString())
                .body(EBResponse.Success(null, AuthMessage.TOKEN_REFRESHED_SUCCESSFULLY));
    }
}
