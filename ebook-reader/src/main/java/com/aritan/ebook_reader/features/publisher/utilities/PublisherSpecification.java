package com.aritan.ebook_reader.features.publisher.utilities;

import com.aritan.ebook_reader.common.models.book.Publisher;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class PublisherSpecification {
    public static Specification<Publisher> hasKeyword(String keyword) {
        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(
                            cb.lower(root.get("publisher_name")),
                            pattern
                    )
            );
        };
    }
}
