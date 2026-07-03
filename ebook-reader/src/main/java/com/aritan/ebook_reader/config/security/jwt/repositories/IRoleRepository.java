package com.aritan.ebook_reader.config.security.jwt.repositories;

import com.aritan.ebook_reader.common.enums.ERole;
import com.aritan.ebook_reader.common.models.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IRoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}
