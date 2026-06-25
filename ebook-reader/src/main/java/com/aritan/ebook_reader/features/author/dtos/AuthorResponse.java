package com.aritan.ebook_reader.features.author.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthorResponse {
    private Long authorId;
    private String authorName;
    private String avatarUrl;
    private String biography;
}
