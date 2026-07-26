package com.aritan.ebook_reader.config.security.jwt.services.interfaces;

import com.aritan.ebook_reader.common.models.token.PasswordResetToken;

import java.util.Optional;

public interface IPasswordResetTokenService {
    Optional<PasswordResetToken> findByToken(String token);
    PasswordResetToken createPasswordResetToken(String email);
    PasswordResetToken verifyExpiration(PasswordResetToken token);
    void deleteByUserId(Long userId);
}
