package com.aritan.ebook_reader.features.book.utilities;

import com.aritan.ebook_reader.common.enums.BookStatus;
import com.aritan.ebook_reader.common.models.Book;
import org.springframework.data.jpa.domain.Specification;

public class BookSpecification {
    public static Specification<Book> hasAuthor(Long authorId) {
        return (root, query, cb) -> {

            if (authorId == null)
                return cb.conjunction();

            return cb.equal(
                    root.join("authors").get("authorId"),
                    authorId);
        };
    }

    public static Specification<Book> hasCategory(Long categoryId) {
        return (root, query, cb) -> {

            if (categoryId == null)
                return cb.conjunction();

            return cb.equal(
                    root.join("categories").get("categoryId"),
                    categoryId);
        };
    }

    public static Specification<Book> hasStatus(BookStatus status) {
        return (root, query, cb) -> {

            if (status == null) {
                return cb.conjunction();
            }

            return cb.equal(root.get("status"), status);
        };
    }

    public static Specification<Book> hasPublisher(Long publisherId) {
        return (root, query, cb) -> {

            if (publisherId == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.get("publisher").get("publisherId"),
                    publisherId
            );
        };
    }

    public static Specification<Book> hasKeyword(String keyword) {
        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(
                            cb.lower(root.get("title")),
                            pattern
                    ),

                    cb.like(
                            cb.lower(root.get("description")),
                            pattern
                    )
            );
        };
    }
}
