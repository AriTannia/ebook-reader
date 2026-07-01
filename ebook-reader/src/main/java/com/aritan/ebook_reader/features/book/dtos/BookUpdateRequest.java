package com.aritan.ebook_reader.features.book.dtos;

import com.aritan.ebook_reader.common.enums.book.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class BookUpdateRequest {
    private String title;
    private String description;
    private BigDecimal price;
    private String coverImageUrl;
    private String language;
    private LocalDate publishedDate;
    private BookStatus status;
    private List<Long> authorIds;
    private List<Long> categoryIds;
    private Long publisherId;
}
