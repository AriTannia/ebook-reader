package com.aritan.ebook_reader.features.library.dtos;

import com.aritan.ebook_reader.common.enums.FormatType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookReaderResponse {
    private Long bookId;
    private String bookTitle;
    private FormatType formatType;
    private String storageUrl;
    private String mimeType;
    private String locator;
    private BigDecimal progressPercent;
}
