package com.aritan.ebook_reader.features.book.utilities;

import com.aritan.ebook_reader.common.constants.rules.BookBadgeRules;
import com.aritan.ebook_reader.common.enums.book.BookBadge;
import com.aritan.ebook_reader.common.enums.book.BookStatus;
import com.aritan.ebook_reader.common.models.book.Book;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
@Component
public class BookSpecification {
    public static Specification<Book> hasAuthor(Long authorId) {
        return (root, query, cb) -> {

            if (authorId == null)
                return cb.conjunction();

            query.distinct(true);
            return cb.equal(
                    root.join("authors").get("authorId"),
                    authorId);
        };
    }

    public static Specification<Book> hasCategory(Long categoryId) {
        return (root, query, cb) -> {

            if (categoryId == null)
                return cb.conjunction();

            query.distinct(true);
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

    public static Specification<Book> hasBadge(BookBadge badge) {
        return (root, query, cb) -> {

            if (badge == null) {
                return null;
            }

            return switch (badge) {

                case NEW -> cb.greaterThanOrEqualTo(
                        root.get("publishedDate"),
                        LocalDate.now()
                                .minusDays(BookBadgeRules.NEW_DAYS)
                );

                case HOT -> cb.and(
                        cb.greaterThanOrEqualTo(
                                root.get("averageRating"),
                                BookBadgeRules.HOT_RATING
                        ),
                        cb.greaterThanOrEqualTo(
                                root.get("reviewCount"),
                                BookBadgeRules.HOT_REVIEW_COUNT
                        )
                );

                case BESTSELLER -> cb.greaterThanOrEqualTo(
                        root.get("soldCopies"),
                        BookBadgeRules.BESTSELLER_SOLD
                );

                default -> cb.conjunction();
            };
        };
    }
}
