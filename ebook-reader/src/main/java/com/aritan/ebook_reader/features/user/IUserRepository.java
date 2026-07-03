package com.aritan.ebook_reader.features.user;

import com.aritan.ebook_reader.common.models.user.User;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserRepository extends
        JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    @Query("""
    SELECT u FROM User u
    LEFT JOIN FETCH u.roles
    WHERE u.email = :email
    """)
    Optional<User> findByEmail(String email);

    @Override
    @EntityGraph(attributePaths = {"roles"})
    @NonNull
    Optional<User> findById(@NonNull Long id);

    @EntityGraph(attributePaths = {"roles"})
    Page<User> findAll(Specification<User> spec, Pageable pageable);
}
