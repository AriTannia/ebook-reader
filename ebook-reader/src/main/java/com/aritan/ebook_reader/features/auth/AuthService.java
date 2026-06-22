package com.aritan.ebook_reader.features.auth;

import com.aritan.ebook_reader.common.constants.AuthMessages;
import com.aritan.ebook_reader.common.constants.UserMessages;
import com.aritan.ebook_reader.common.enums.ERole;
import com.aritan.ebook_reader.common.exception.AuthenticationException;
import com.aritan.ebook_reader.common.exception.DataDuplicateException;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.RefreshToken;
import com.aritan.ebook_reader.common.models.Role;
import com.aritan.ebook_reader.common.models.User;
import com.aritan.ebook_reader.config.security.jwt.services.UserDetailsImpl;
import com.aritan.ebook_reader.config.security.jwt.repositories.IRoleRepository;
import com.aritan.ebook_reader.config.security.jwt.services.interfaces.IRefreshTokenService;
import com.aritan.ebook_reader.config.security.jwt.utilities.JwtUtils;
import com.aritan.ebook_reader.features.auth.dtos.*;
import com.aritan.ebook_reader.features.user.IUserRepository;
import com.aritan.ebook_reader.features.auth.dtos.UserAuthResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService{
    private final IRefreshTokenService refreshTokenService;
    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    @Override
    public UserAuthenticationResponse authenticateUser(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            // Generate Jwt
            ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            // Generate RefreshToken
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
            ResponseCookie jwtRefreshCookie = jwtUtils.generateRefreshJwtCookie(refreshToken.getToken());

            UserJwtHeaderResponse userJwtHeaderResponse = new UserJwtHeaderResponse(jwtCookie, jwtRefreshCookie);
            UserAuthResponse userAuthResponse = new UserAuthResponse(userDetails.getId(),
                    userDetails.getEmail(),
                    userDetails.getUsername(),
                    roles);

            return new UserAuthenticationResponse(
                    userJwtHeaderResponse,
                    userAuthResponse
            );
        } catch (BadCredentialsException e){
            throw new AuthenticationException(AuthMessages.INVALID_CREDENTIALS);
        }
    }

    @Override
    public User registerUser(SignupRequest request) {
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new DataDuplicateException(UserMessages.EMAIL_IN_USE);
        }

        // Create new user's account
        User user = new User(request.getFullName(), request.getEmail(),
                passwordEncoder.encode(request.getPassword()));

        Set<String> strRoles = request.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new ResourceNotFoundException(UserMessages.ROLE_NOT_FOUND));
            roles.add(userRole);
        } else {
            strRoles.forEach(strRole -> {
                ERole eRole = ERole.getOrDefault(strRole);

                Role existedRole = roleRepository.findByName(eRole)
                        .orElseThrow(() -> new ResourceNotFoundException(UserMessages.ROLE_NOT_FOUND));
                roles.add(existedRole);
            });
        }

        user.setRoles(roles);
        return userRepository.save(user);
    }

    @Override
    public UserJwtHeaderResponse signOutUser() {
        Object principle = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!Objects.equals(principle.toString(), "anonymousUser")){
            Long userId = ((UserDetailsImpl) principle).getId();
            refreshTokenService.deleteByUserId(userId);
        }

        ResponseCookie jwtCookie = jwtUtils.getCleanJwtCookie();
        ResponseCookie jwtRefreshCookie = jwtUtils.getCleanJwtRefreshCookie();

        return new UserJwtHeaderResponse(jwtCookie, jwtRefreshCookie);
    }

    @Override
    public ResponseCookie refreshToken(HttpServletRequest request) {
        String refreshToken = jwtUtils.getJwtRefreshFromCookies(request);

        if(refreshToken != null && !refreshToken.isEmpty()){
            return refreshTokenService.findByToken(refreshToken)
                    .map(refreshTokenService::verifyExpiration)
                    .map(RefreshToken::getUser)
                    .map(jwtUtils::generateJwtCookie)
                    .orElseThrow(() -> new ResourceNotFoundException(AuthMessages.REFRESH_TOKEN_NOT_FOUND));
        }
        throw new ResourceNotFoundException(AuthMessages.REFRESH_TOKEN_EMPTY);
    }
}
