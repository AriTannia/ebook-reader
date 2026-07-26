package com.aritan.ebook_reader.features.book.bookformat;

import com.aritan.ebook_reader.features.book.dtos.BookFormatCreateRequest;
import com.aritan.ebook_reader.features.book.dtos.BookFormatResponse;

import java.util.List;

public interface IBookFormatService {
    List<BookFormatResponse> getBookFormatsByBookId(Long bookId);

    BookFormatResponse getBookFormatById(Long bookId, Long bookFormatId);

    BookFormatResponse createBookFormat(Long bookId, BookFormatCreateRequest request);

    BookFormatResponse updateIsPrimaryFormat(Long bookId, Long bookFormatId, boolean isPrimary);

    void deleteBookFormat(Long bookId, Long bookFormatId);
}
