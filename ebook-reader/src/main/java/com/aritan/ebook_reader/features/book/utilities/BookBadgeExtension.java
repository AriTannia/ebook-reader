package com.aritan.ebook_reader.features.book.utilities;

import com.aritan.ebook_reader.common.constants.rules.BookBadgeRules;
import com.aritan.ebook_reader.common.enums.book.BookBadge;
import com.aritan.ebook_reader.common.models.book.Book;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class BookBadgeExtension {
    public BookBadge calculate(Book book) {

        if (book.getPublishedDate() != null
                && book.getPublishedDate()
                .isAfter(
                        LocalDate.now()
                                .minusDays(BookBadgeRules.NEW_DAYS))) {
            return BookBadge.NEW;
        }

        if (book.getSoldCopies() != null
                && book.getSoldCopies()
                >= BookBadgeRules.BESTSELLER_SOLD) {
            return BookBadge.BESTSELLER;
        }

        if (book.getAverageRating() != null
                && book.getReviewCount() != null
                && book.getAverageRating()
                .compareTo(BookBadgeRules.HOT_RATING) >= 0
                && book.getReviewCount()
                >= BookBadgeRules.HOT_REVIEW_COUNT) {
            return BookBadge.HOT;
        }

        return BookBadge.NONE;
    }
}
