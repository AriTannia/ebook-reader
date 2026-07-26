package com.aritan.ebook_reader.config.security.jwt.repositories;

import com.aritan.ebook_reader.common.models.token.PasswordResetToken;
import com.aritan.ebook_reader.common.models.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user);
}
