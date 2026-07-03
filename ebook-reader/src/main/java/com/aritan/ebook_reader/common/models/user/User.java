package com.aritan.ebook_reader.common.models.user;

import com.aritan.ebook_reader.common.constants.tables.user.RoleTableConstants;
import com.aritan.ebook_reader.common.constants.tables.user.UserTableConstants;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = UserTableConstants.TABLE_NAME, schema = UserTableConstants.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = UserTableConstants.USER_ID, updatable = false, nullable = false)
    private Long userId;

    @Column(name = UserTableConstants.EMAIL, nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = UserTableConstants.PASSWORD_HASH, nullable = false)
    private String passwordHash;

    @Column(name = UserTableConstants.AVATAR_URL, columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(name = UserTableConstants.FULL_NAME, length = 60)
    private String fullName;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = UserTableConstants.USER_ROLES_TABLE,
            joinColumns = @JoinColumn(name = UserTableConstants.USER_ID),
            inverseJoinColumns = @JoinColumn(name = RoleTableConstants.ROLE_ID))

    private Set<Role> roles = new HashSet<>();

    @CreatedDate
    @Column(name = UserTableConstants.CREATED_AT, updatable = false, nullable = false)
    private Date createdAt;

    public User(String fullName, String email, String password) {
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = password;
    }
}
