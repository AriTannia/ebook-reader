package com.aritan.ebook_reader.features.author.utilities;

import com.aritan.ebook_reader.common.models.book.Author;
import org.springframework.data.jpa.domain.Specification;

public class AuthorSpecification {
    public static Specification<Author> hasKeyword(String keyword) {
        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(
                            cb.lower(root.get("author_name")),
                            pattern
                    ),

                    cb.like(
                            cb.lower(root.get("biography")),
                            pattern
                    )
            );
        };
    }
}
