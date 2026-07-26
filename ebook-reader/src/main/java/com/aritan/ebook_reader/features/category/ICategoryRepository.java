package com.aritan.ebook_reader.features.category;

import com.aritan.ebook_reader.common.models.book.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ICategoryRepository extends
        JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {
    boolean existsByCategoryName(String categoryName);

    boolean existsBySlug(String slug);

    boolean existsByCategoryNameAndCategoryIdNot(String categoryName, Long categoryId);

    boolean existsBySlugAndCategoryIdNot(String slug, Long categoryId);
}
