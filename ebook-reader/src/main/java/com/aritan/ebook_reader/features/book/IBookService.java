package com.aritan.ebook_reader.features.book;

import com.aritan.ebook_reader.common.enums.book.BookBadge;
import com.aritan.ebook_reader.features.book.dtos.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IBookService {
    Page<BookResponse> getPagedBooks(BookFilterRequest request, Pageable pageable, BookBadge badge);

    Page<BookAdminResponse> searchBooks(BookFilterRequest request, Pageable pageable, BookBadge badge);

    BookDetailsResponse getBookById(Long bookId);

    List<BookAdminResponse> createBook(List<BookCreateRequest> requests);

    BookAdminResponse updateBook(BookUpdateRequest updateRequest, Long bookId);

    void deleteBook(Long bookId);
}
