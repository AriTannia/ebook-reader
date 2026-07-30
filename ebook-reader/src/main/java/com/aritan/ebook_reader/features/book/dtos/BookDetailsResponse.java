package com.aritan.ebook_reader.features.book.dtos;

import com.aritan.ebook_reader.common.enums.book.BookStatus;
import com.aritan.ebook_reader.features.publisher.dtos.PublisherResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class BookDetailsResponse {
    private Long bookId;
    private String title;
    private String description;
    private BigDecimal price;
    private String coverImageUrl;
    private String language;
    private LocalDate publishedDate;
    private BookStatus status;
    private boolean existedInLibrary;
    private boolean existedUserReview;
    private boolean pendingOrder;
    private Set<BookAuthorResponse> authors;
    private Set<BookCategoryResponse> categories;
    private Set<BookTagResponse> tags;
    private PublisherResponse publisher;

}
