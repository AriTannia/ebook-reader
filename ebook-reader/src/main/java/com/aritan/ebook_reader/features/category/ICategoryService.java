package com.aritan.ebook_reader.features.category;

import com.aritan.ebook_reader.features.category.dtos.CategoryCreateRequest;
import com.aritan.ebook_reader.features.category.dtos.CategoryFilterRequest;
import com.aritan.ebook_reader.features.category.dtos.CategoryResponse;
import com.aritan.ebook_reader.features.category.dtos.CategoryUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ICategoryService {
    Page<CategoryResponse> getAllCategories(CategoryFilterRequest request, Pageable page);

    CategoryResponse getCategoryById(Long categoryId);

    List<CategoryResponse> createCategory(List<CategoryCreateRequest> requests);

    CategoryResponse updateCategory(CategoryUpdateRequest updateRequest, Long categoryId);

    void deleteCategory(Long categoryId);
}
