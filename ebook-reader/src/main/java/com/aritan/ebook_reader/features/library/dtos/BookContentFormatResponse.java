package com.aritan.ebook_reader.features.library.dtos;

import com.aritan.ebook_reader.common.enums.book.FormatType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookContentFormatResponse {
    private Long bookId;
    private String bookTitle;
    private FormatType formatType;
    private String mimeType;
}
