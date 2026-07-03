package com.aritan.ebook_reader.features.library.utilities;

import com.aritan.ebook_reader.common.enums.book.LibraryAccessStatus;
import com.aritan.ebook_reader.common.models.book.Author;
import com.aritan.ebook_reader.common.models.book.Book;
import com.aritan.ebook_reader.common.models.book.Category;
import com.aritan.ebook_reader.common.models.book.UserLibrary;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class LibrarySpecification {
    public static Specification<UserLibrary> hasUser(Long userId) {
        return (root, query, cb) -> {
            if (userId == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("user").get("userId"), userId);
        };
    }

    public static Specification<UserLibrary> hasAccessStatus(LibraryAccessStatus accessStatus) {
        return (root, query, cb) -> {
            if (accessStatus == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("accessStatus"), accessStatus);
        };
    }

    public static Specification<UserLibrary> isFavorite(Boolean isFavorite) {
        return (root, query, cb) -> {
            if (isFavorite == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("isFavorite"), isFavorite);
        };
    }

    public static Specification<UserLibrary> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }
            String pattern = "%" + keyword.toLowerCase() + "%";
            return cb.like(
                    cb.lower(root.get("book").get("title")),
                    pattern
            );
        };
    }

    public static Specification<UserLibrary> hasAuthor(Long authorId) {
        return (root, query, cb) -> {
            if (authorId == null) {
                return cb.conjunction();
            }
            query.distinct(true);
            Join<UserLibrary, Book> book = root.join("book");
            Join<Book, Author> author = book.join("authors");
            return cb.equal(author.get("authorId"), authorId);
        };
    }

    public static Specification<UserLibrary> hasCategory(Long categoryId) {
        return (root, query, cb) -> {
            if (categoryId == null) {
                return cb.conjunction();
            }
            query.distinct(true);
            Join<UserLibrary, Book> book = root.join("book");
            Join<Book, Category> category = book.join("categories");
            return cb.equal(category.get("categoryId"), categoryId);
        };
    }
}
