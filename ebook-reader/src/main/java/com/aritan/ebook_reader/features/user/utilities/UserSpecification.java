package com.aritan.ebook_reader.features.user.utilities;

import com.aritan.ebook_reader.common.models.user.User;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class UserSpecification {
    public static Specification<User> hasKeyword(String keyword) {
        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(
                            cb.lower(root.get("fullName")),
                            pattern
                    ),
                    cb.like(
                            cb.lower(root.get("email")),
                            pattern
                    )
            );
        };
    }
}
