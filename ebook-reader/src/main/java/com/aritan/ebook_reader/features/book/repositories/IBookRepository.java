package com.aritan.ebook_reader.features.book.repositories;

import com.aritan.ebook_reader.common.models.book.Book;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
public interface IBookRepository extends
        JpaRepository<Book, Long>,
        JpaSpecificationExecutor<Book>,
        IBookRepositoryCustom {
    @EntityGraph(attributePaths = {
            "authors"
    })
    @NonNull
    Page<Book> findAll(@NonNull Specification<Book> spec, @NonNull Pageable pageable);
    @EntityGraph(attributePaths = {
            "authors",
            "categories",
            "publisher",
            "tags"
    })
    Optional<Book> findByBookId(Long bookId);
    boolean existsByCategories_CategoryId(Long categoryId);
    boolean existsByBookId(Long bookId);
}
