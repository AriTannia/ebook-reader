package com.aritan.ebook_reader.config.security.jwt.services;

import com.aritan.ebook_reader.common.models.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter
public class UserDetailsImpl implements UserDetails {
    @Serial
    private static final long serialVersionUID = 1L;
    private final Long id;
    private final String email;
    private final String username;
    private final String fullName;
    @JsonIgnore
    private final String password;

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsImpl.class);
    private final Collection<? extends GrantedAuthority> authorities;
    public UserDetailsImpl(Long id, String fullName, String email, String password,
                           Collection<? extends GrantedAuthority> authorities) {
        this.id  = id;
        this.username = email;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    // Factory Method
    public static UserDetailsImpl build(User user){
        List<GrantedAuthority> authorityList = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        logger.info(">>> User {} has authorities: {}", user.getEmail(), authorityList);

        return new UserDetailsImpl(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getPasswordHash(),
                authorityList);
    }
    @Override
    @NonNull
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public @Nullable String getPassword() {
        return password;
    }

    @Override
    @NonNull
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }

    @Override
    public boolean equals(Object o){
        if(this == o) return true;
        if(o == null || getClass() != o.getClass()) return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
