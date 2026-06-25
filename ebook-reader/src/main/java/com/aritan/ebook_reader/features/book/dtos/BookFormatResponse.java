package com.aritan.ebook_reader.features.book.dtos;

import com.aritan.ebook_reader.common.enums.FormatType;
import com.aritan.ebook_reader.common.models.Book;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BookFormatResponse {
    private Long bookFormatId;
    private Book book;
    private FormatType formatType;
    private String storageUrl;
    private String mimeType;
    private Long fileSize;
    private Boolean isPrimary;
}
