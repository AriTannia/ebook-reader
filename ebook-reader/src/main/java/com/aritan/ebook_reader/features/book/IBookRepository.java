package com.aritan.ebook_reader.features.book;

import com.aritan.ebook_reader.common.models.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IBookRepository extends
        JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
    @EntityGraph(attributePaths = {
            "authors",
            "categories",
            "publisher"
    })
    Optional<Book> findByBookId(Long bookId);
}
