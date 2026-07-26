package com.aritan.ebook_reader.features.category.utilities;

import com.aritan.ebook_reader.common.constants.messages.book.CategoryMessage;
import com.aritan.ebook_reader.common.exception.ValidationException;
import com.aritan.ebook_reader.features.category.ICategoryRepository;
import com.aritan.ebook_reader.features.category.dtos.CategoryCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;
@Component
@RequiredArgsConstructor
public class CategoryValidator {
    private final ICategoryRepository categoryRepository;
    public void validateUniqueForCreate(String categoryName, String slug) {
        if (categoryRepository.existsByCategoryName(categoryName)) {
            throw new ValidationException(
                    String.format(CategoryMessage.IS_CATEGORY_ALREADY_EXIST, categoryName)
            );
        }
        if (categoryRepository.existsBySlug(slug)) {
            throw new ValidationException(
                    String.format(CategoryMessage.IS_SLUG_ALREADY_EXIST, slug)
            );
        }
    }

    public void validateUniqueForUpdate(Long categoryId, String categoryName, String slug) {
        if (categoryRepository.existsByCategoryNameAndCategoryIdNot(categoryName, categoryId)) {
            throw new ValidationException(
                    String.format(CategoryMessage.IS_CATEGORY_ALREADY_EXIST, categoryName)
            );
        }
        if (categoryRepository.existsBySlugAndCategoryIdNot(slug, categoryId)) {
            throw new ValidationException(
                    String.format(CategoryMessage.IS_SLUG_ALREADY_EXIST, slug)
            );
        }
    }

    public void validateNoDuplicateInBatch(List<CategoryCreateRequest> requests) {
        Set<String> names = new HashSet<>();
        Set<String> slugs = new HashSet<>();
        for (CategoryCreateRequest r : requests) {
            if (!names.add(r.getCategoryName())) {
                throw new ValidationException(String.format(
                        CategoryMessage.DUPLICATE_CATEGORY_NAME_REQUEST, r.getCategoryName()));
            }
            if (!slugs.add(r.getSlug())) {
                throw new ValidationException(String.format(
                        CategoryMessage.DUPLICATE_SLUG_NAME_REQUEST, r.getSlug()));
            }
        }
    }
}
