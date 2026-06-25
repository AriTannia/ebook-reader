package com.aritan.ebook_reader.features.category.utilities;

import com.aritan.ebook_reader.common.models.Category;
import com.aritan.ebook_reader.features.category.dtos.CategoryCreateRequest;
import com.aritan.ebook_reader.features.category.dtos.CategoryResponse;
import com.aritan.ebook_reader.features.category.dtos.CategoryUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toCategoryResponse(Category category);

    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Category toCategory(CategoryCreateRequest createRequest);

    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateCategory(
            CategoryUpdateRequest updateRequest,
            @MappingTarget Category category
    );
}
