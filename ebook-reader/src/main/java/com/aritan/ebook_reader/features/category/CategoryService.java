package com.aritan.ebook_reader.features.category;

import com.aritan.ebook_reader.common.constants.messages.CategoryMessage;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.Category;
import com.aritan.ebook_reader.features.category.dtos.CategoryCreateRequest;
import com.aritan.ebook_reader.features.category.dtos.CategoryFilterRequest;
import com.aritan.ebook_reader.features.category.dtos.CategoryResponse;
import com.aritan.ebook_reader.features.category.dtos.CategoryUpdateRequest;
import com.aritan.ebook_reader.features.category.utilities.CategoryMapper;
import com.aritan.ebook_reader.features.category.utilities.CategorySpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService{
    private final ICategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
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
    public List<CategoryResponse> createCategory(List<CategoryCreateRequest> requests) {
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

        categoryMapper.updateCategory(updateRequest, existedCategory);
        Category updatedCategory = categoryRepository.save(existedCategory);

        return categoryMapper.toCategoryResponse(updatedCategory);
    }

    @Override
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(CategoryMessage.CATEGORY_NOT_FOUND, categoryId)
                ));

        categoryRepository.delete(category);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().map(categoryMapper::toCategoryResponse).toList();
    }
}
