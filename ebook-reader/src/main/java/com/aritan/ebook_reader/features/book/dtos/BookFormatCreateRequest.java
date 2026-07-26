package com.aritan.ebook_reader.features.book.dtos;

import com.aritan.ebook_reader.common.enums.book.FormatType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BookFormatCreateRequest {
    private FormatType formatType;
    private String storageUrl;
    private String mimeType;
    private Long fileSize;
    private Boolean isPrimary;
}
