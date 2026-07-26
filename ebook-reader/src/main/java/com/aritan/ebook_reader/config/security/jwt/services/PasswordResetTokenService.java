package com.aritan.ebook_reader.config.security.jwt.services;

import com.aritan.ebook_reader.common.constants.messages.user.AuthMessage;
import com.aritan.ebook_reader.common.constants.messages.user.UserMessage;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.exception.TokenException;
import com.aritan.ebook_reader.common.models.token.PasswordResetToken;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.config.security.jwt.repositories.IPasswordResetTokenRepository;
import com.aritan.ebook_reader.config.security.jwt.services.interfaces.IPasswordResetTokenService;
import com.aritan.ebook_reader.features.user.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService implements IPasswordResetTokenService {
    @Value("${ebook-reader.app.passwordResetTokenExpirationMs}")
    private Long passwordResetTokenDurationMs;
    private final IPasswordResetTokenRepository passwordResetTokenRepository;
    private final IUserRepository userRepository;
    @Override
    public Optional<PasswordResetToken> findByToken(String token) {
        return passwordResetTokenRepository.findByToken(token);
    }

    @Override
    @Transactional
    public PasswordResetToken createPasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(UserMessage.USER_NOT_FOUND_WITH_EMAIL, email)
                ));

        deleteByUserId(user.getUserId());

        PasswordResetToken token = new PasswordResetToken();

        token.setUser(user);
        token.setToken(java.util.UUID.randomUUID().toString());
        token.setExpiryDate(java.time.Instant.now().plusMillis(passwordResetTokenDurationMs));

        return passwordResetTokenRepository.save(token);
    }

    @Override
    public PasswordResetToken verifyExpiration(PasswordResetToken token) {
        if(token.getExpiryDate().compareTo(java.time.Instant.now()) < 0){
            passwordResetTokenRepository.delete(token);
            throw new TokenException(token.getToken(), AuthMessage.PASSWORD_RESET_TOKEN_EXPIRED);
        }

        return token;
    }

    @Override
    @Transactional
    public void deleteByUserId(Long userId) {
        passwordResetTokenRepository.deleteByUser(userRepository.getReferenceById(userId));
        passwordResetTokenRepository.flush();
    }
}
