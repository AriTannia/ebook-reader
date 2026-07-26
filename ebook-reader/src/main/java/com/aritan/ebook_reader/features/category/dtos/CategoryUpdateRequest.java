package com.aritan.ebook_reader.features.category.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryUpdateRequest {
    @NotBlank(message = "Category name is required")
    private String categoryName;
    @NotBlank(message = "Description is required")
    private String description;
    @NotBlank(message = "Slug is required")
    private String slug;
}
