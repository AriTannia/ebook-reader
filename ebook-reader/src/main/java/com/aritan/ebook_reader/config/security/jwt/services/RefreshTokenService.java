package com.aritan.ebook_reader.config.security.jwt.services;

import com.aritan.ebook_reader.common.constants.AuthMessages;
import com.aritan.ebook_reader.common.constants.UserMessages;
import com.aritan.ebook_reader.common.exception.TokenRefreshException;
import com.aritan.ebook_reader.common.models.RefreshToken;
import com.aritan.ebook_reader.config.security.jwt.repositories.IRefreshTokenRepository;
import com.aritan.ebook_reader.config.security.jwt.services.interfaces.IRefreshTokenService;
import com.aritan.ebook_reader.features.user.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService implements IRefreshTokenService {
    @Value("${ebook-reader.app.jwtRefreshExpirationMs}")
    private Long refreshTokenDurationMs;
    private final IRefreshTokenRepository refreshTokenRepository;
    private final IUserRepository userRepository;
    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    public RefreshToken createRefreshToken(Long userId) {
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(userRepository.findById(userId).get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if(token.getExpiryDate().compareTo(Instant.now()) < 0){
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), AuthMessages.REFRESH_TOKEN_EXPIRED);
        }

        return token;
    }

    @Override
    public void deleteByUserId(Long userId) {
        refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
    }
}
