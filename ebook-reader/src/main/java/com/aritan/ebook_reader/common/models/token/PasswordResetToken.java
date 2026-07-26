package com.aritan.ebook_reader.common.models.token;

import com.aritan.ebook_reader.common.constants.tables.token.PasswordResetTokenTableConstants;
import com.aritan.ebook_reader.common.constants.tables.user.UserTableConstants;
import com.aritan.ebook_reader.common.models.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = PasswordResetTokenTableConstants.TABLE_NAME, schema = PasswordResetTokenTableConstants.SCHEMA)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = PasswordResetTokenTableConstants.PASSWORD_RESET_TOKEN_ID, nullable = false)
    private Long passwordResetTokenId;

    @Column(
            name = PasswordResetTokenTableConstants.TOKEN,
            nullable = false,
            unique = true,
            columnDefinition = "TEXT"
    )
    private String token;

    @OneToOne
    @JoinColumn(
            name = PasswordResetTokenTableConstants.USER_ID,
            referencedColumnName = UserTableConstants.USER_ID,
            nullable = false)
    private User user;

    @Column(name = PasswordResetTokenTableConstants.EXPIRY_DATE, nullable = false)
    private Instant expiryDate;
}
