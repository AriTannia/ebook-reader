package com.aritan.ebook_reader.features.author.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthorBookResponse {
    private Long authorId;
    private String authorName;
    private String avatarUrl;
}
