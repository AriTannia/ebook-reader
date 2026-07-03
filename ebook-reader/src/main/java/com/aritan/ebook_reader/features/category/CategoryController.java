package com.aritan.ebook_reader.features.category;

import com.aritan.ebook_reader.common.constants.messages.book.CategoryMessage;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.category.dtos.CategoryCreateRequest;
import com.aritan.ebook_reader.features.category.dtos.CategoryFilterRequest;
import com.aritan.ebook_reader.features.category.dtos.CategoryResponse;
import com.aritan.ebook_reader.features.category.dtos.CategoryUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/categories")
public class CategoryController {
    private final ICategoryService categoryService;

    // Public
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<List<CategoryResponse>>> getAllCategories(){
        var result = categoryService.getAllCategories();

        return ResponseEntity.ok(EBResponse.Success(result, CategoryMessage.CATEGORIES_RETRIEVED_SUCCESSFULLY));
    }


    @GetMapping("{categoryId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<CategoryResponse>> getCategoryById(@PathVariable Long categoryId){
        var result = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(
                EBResponse.Success(result,
                        String.format(CategoryMessage.CATEGORY_RETRIEVED_SUCCESSFULLY, categoryId)));
    }

    // Admin
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<CategoryResponse>>> getAllCategoriesByAdmin(CategoryFilterRequest request, Pageable page){
        var result = categoryService.getAllCategoriesByAdmin(request, page);

        return ResponseEntity.ok(EBResponse.Success(result, CategoryMessage.CATEGORIES_RETRIEVED_SUCCESSFULLY));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<List<CategoryResponse>>> createCategory(
            @RequestBody List<CategoryCreateRequest> requests){
        var result = categoryService.createCategory(requests);
        return ResponseEntity.ok(EBResponse.Created(result, CategoryMessage.CATEGORY_CREATED_SUCCESSFULLY));
    }

    @PutMapping("/{categoryId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<CategoryResponse>> updateCategory(
            @RequestBody CategoryUpdateRequest updateRequest,
            @PathVariable Long categoryId){
        var result = categoryService.updateCategory(updateRequest, categoryId);
        return ResponseEntity.ok(
                EBResponse.Success(result,
                        String.format(CategoryMessage.CATEGORY_UPDATED_SUCCESSFULLY, categoryId)));
    }

    @DeleteMapping("/{categoryId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<?>> deleteCategory(@PathVariable Long categoryId){
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok(
                EBResponse.Success(null,
                        String.format(CategoryMessage.CATEGORY_DELETED_SUCCESSFULLY, categoryId)));
    }
}
