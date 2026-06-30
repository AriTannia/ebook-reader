package com.aritan.ebook_reader.features.book;

import com.aritan.ebook_reader.common.models.Book;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IBookRepository extends
        JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
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
}
