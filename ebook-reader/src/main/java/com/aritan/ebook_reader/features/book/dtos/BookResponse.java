package com.aritan.ebook_reader.features.book.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class BookResponse {
    private Long bookId;
    private String title;
    private BigDecimal price;
    private String coverImageUrl;
    private String language;
    private LocalDate publishedDate;
}
