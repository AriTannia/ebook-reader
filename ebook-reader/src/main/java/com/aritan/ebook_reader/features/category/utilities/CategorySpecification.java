package com.aritan.ebook_reader.features.category.utilities;

import com.aritan.ebook_reader.common.models.Author;
import com.aritan.ebook_reader.common.models.Category;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class CategorySpecification {
    public static Specification<Category> hasKeyword(String keyword) {
        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(
                            cb.lower(root.get("category_name")),
                            pattern
                    ),

                    cb.like(
                            cb.lower(root.get("description")),
                            pattern
                    ),

                    cb.like(
                            cb.lower(root.get("slug")),
                            pattern
                    )
            );
        };
    }
}
