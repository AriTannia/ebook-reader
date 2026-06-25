package com.aritan.ebook_reader.features.category.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CategoryBookResponse {
    private Long categoryId;
    private String categoryName;
    private String slug;
}
