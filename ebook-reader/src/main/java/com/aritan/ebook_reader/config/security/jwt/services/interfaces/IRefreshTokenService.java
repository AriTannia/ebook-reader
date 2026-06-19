package com.aritan.ebook_reader.config.security.jwt.services.interfaces;

import com.aritan.ebook_reader.common.models.RefreshToken;

import java.util.Optional;

public interface IRefreshTokenService {
    Optional<RefreshToken> findByToken(String token);
    RefreshToken createRefreshToken(Long userId);
    RefreshToken verifyExpiration(RefreshToken token);
    void deleteByUserId(Long userId);
}
