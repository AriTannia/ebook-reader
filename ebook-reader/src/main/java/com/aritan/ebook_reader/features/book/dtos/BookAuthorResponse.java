package com.aritan.ebook_reader.features.book.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookAuthorResponse {
    private Long authorId;
    private String authorName;
    private String avatarUrl;
}
