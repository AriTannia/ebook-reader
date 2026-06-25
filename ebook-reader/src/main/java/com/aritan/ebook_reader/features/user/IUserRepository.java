package com.aritan.ebook_reader.features.user;

import com.aritan.ebook_reader.common.models.User;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {
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
}
