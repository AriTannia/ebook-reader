package com.aritan.ebook_reader.features.book;

import com.aritan.ebook_reader.features.book.dtos.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IBookService {
    Page<BookResponse> getPagedBooks(BookFilterRequest request, Pageable pageable);

    BookDetailsResponse getBookById(Long bookId);

    List<BookDetailsResponse> createBook(List<BookCreateRequest> requests);

    BookDetailsResponse updateBook(BookUpdateRequest updateRequest, Long bookId);

    void deleteBook(Long bookId);
}
