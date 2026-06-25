package com.aritan.ebook_reader.features.book.dtos;

import com.aritan.ebook_reader.common.enums.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookFilterRequest {
    private Long authorId;
    private Long categoryId;
    private Long publisherId;
    private String keyword;
}
