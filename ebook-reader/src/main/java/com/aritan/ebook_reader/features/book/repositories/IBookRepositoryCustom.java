package com.aritan.ebook_reader.features.book.repositories;

import com.aritan.ebook_reader.common.models.book.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface IBookRepositoryCustom {
    Page<Book> findAllBooksForAdmin(Specification<Book> spec, Pageable pageable);
}
