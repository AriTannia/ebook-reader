package com.aritan.ebook_reader.features.category;

import com.aritan.ebook_reader.common.constants.messages.book.CategoryMessage;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.exception.ValidationException;
import com.aritan.ebook_reader.common.models.book.Category;
import com.aritan.ebook_reader.features.book.repositories.IBookRepository;
import com.aritan.ebook_reader.features.category.dtos.CategoryCreateRequest;
import com.aritan.ebook_reader.features.category.dtos.CategoryFilterRequest;
import com.aritan.ebook_reader.features.category.dtos.CategoryResponse;
import com.aritan.ebook_reader.features.category.dtos.CategoryUpdateRequest;
import com.aritan.ebook_reader.features.category.utilities.CategoryMapper;
import com.aritan.ebook_reader.features.category.utilities.CategorySpecification;
import com.aritan.ebook_reader.features.category.utilities.CategoryValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService{
    private final ICategoryRepository categoryRepository;
    private final IBookRepository bookRepository;
    private final CategoryMapper categoryMapper;
    private final CategoryValidator validator;
    @Override
    public Page<CategoryResponse> getAllCategoriesByAdmin(CategoryFilterRequest request, Pageable page) {
        Specification<Category> spec = Specification
                .where(CategorySpecification.hasKeyword(request.getKeyword()));

        Page<Category> categories = categoryRepository.findAll(spec, page);
        return categories.map(categoryMapper::toCategoryResponse);
    }

    @Override
    public CategoryResponse getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(CategoryMessage.CATEGORY_NOT_FOUND, categoryId)));

        return categoryMapper.toCategoryResponse(category);
    }

    @Override
    @Transactional
    public List<CategoryResponse> createCategory(List<CategoryCreateRequest> requests) {
        validator.validateNoDuplicateInBatch(requests);
        requests.forEach(r ->
                validator.validateUniqueForCreate(r.getCategoryName(), r.getSlug()));

        List<Category> categories = requests.stream()
                        .map(categoryMapper::toCategory)
                        .toList();

        List<Category> savedCategories = categoryRepository.saveAll(categories);

        return savedCategories.stream().map(categoryMapper::toCategoryResponse).toList();
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(CategoryUpdateRequest updateRequest, Long categoryId) {
        Category existedCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(CategoryMessage.CATEGORY_NOT_FOUND, categoryId)
                ));

        validator.validateUniqueForUpdate(
                categoryId,
                updateRequest.getCategoryName(),
                updateRequest.getSlug());

        categoryMapper.updateCategory(updateRequest, existedCategory);
        Category updatedCategory = categoryRepository.save(existedCategory);

        return categoryMapper.toCategoryResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(CategoryMessage.CATEGORY_NOT_FOUND, categoryId)
                ));

        if (bookRepository.existsByCategories_CategoryId(categoryId)) {
            throw new ValidationException(
                    String.format(CategoryMessage.IS_HAS_BOOKS_ASSIGNED, categoryId)
            );
        }

        categoryRepository.delete(category);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().map(categoryMapper::toCategoryResponse).toList();
    }
}
