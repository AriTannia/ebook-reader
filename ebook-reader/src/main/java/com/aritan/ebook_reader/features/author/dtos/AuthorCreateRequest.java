package com.aritan.ebook_reader.features.author.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthorCreateRequest {
    @NotBlank(message = "Author name is required")
    private String authorName;
    private String avatarUrl;
    @NotBlank(message = "Biography is required")
    private String biography;
}
