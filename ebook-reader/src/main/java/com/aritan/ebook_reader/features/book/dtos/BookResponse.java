package com.aritan.ebook_reader.features.book.dtos;

import com.aritan.ebook_reader.common.enums.book.BookBadge;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class BookResponse {
    private Long bookId;
    private String title;
    private BigDecimal price;
    private String coverImageUrl;
    private BookBadge badge;
    private BigDecimal averageRating;
    private Long reviewCount;
    private Long soldCopies;
    private String language;
    private Set<BookAuthorResponse> authors;
    private LocalDate publishedDate;
}
