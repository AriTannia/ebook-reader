package com.aritan.ebook_reader.config.security.jwt.repositories;

import com.aritan.ebook_reader.common.models.RefreshToken;
import com.aritan.ebook_reader.common.models.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface IRefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    @Transactional
    @Modifying
    void deleteByUser(User user);
}
