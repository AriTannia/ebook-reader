package com.aritan.ebook_reader.common.models;

import com.aritan.ebook_reader.common.constants.tables.RefreshTokenTableConstants;
import com.aritan.ebook_reader.common.constants.tables.UserTableConstants;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = RefreshTokenTableConstants.TABLE_NAME, schema = RefreshTokenTableConstants.SCHEMA)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = RefreshTokenTableConstants.REFRESH_TOKEN_ID, nullable = false)
    private Long refreshTokenId;

    @OneToOne
    @JoinColumn(
            name = RefreshTokenTableConstants.USER_ID,
            referencedColumnName = UserTableConstants.USER_ID,
            nullable = false)
    private User user;

    @Column(name = RefreshTokenTableConstants.TOKEN, nullable = false, unique = true, columnDefinition = "TEXT")
    private String token;

    @Column(name = RefreshTokenTableConstants.EXPIRY_DATE, nullable = false)
    private Instant expiryDate;
}
