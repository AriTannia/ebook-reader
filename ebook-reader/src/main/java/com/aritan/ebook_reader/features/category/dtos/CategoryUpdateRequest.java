package com.aritan.ebook_reader.features.category.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryUpdateRequest {
    private String categoryName;
    private String description;
    private String slug;
}
