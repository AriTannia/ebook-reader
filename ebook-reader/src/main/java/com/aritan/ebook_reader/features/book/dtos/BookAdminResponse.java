package com.aritan.ebook_reader.features.book.dtos;

import com.aritan.ebook_reader.common.enums.book.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookAdminResponse {
    private Long bookId;
    private String title;
    private String coverImageUrl;
    private BigDecimal price;
    private String authorNames;
    private BookStatus status;
    private Long soldCopies;
}