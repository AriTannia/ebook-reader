package com.aritan.ebook_reader.features.book.bookformat;

import com.aritan.ebook_reader.common.models.BookFormat;
import com.aritan.ebook_reader.features.book.dtos.BookFormatCreateRequest;
import com.aritan.ebook_reader.features.book.dtos.BookFormatResponse;
import com.aritan.ebook_reader.features.book.dtos.BookFormatUpdateRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IBookFormatService {
    List<BookFormatResponse> getBookFormatsByBookId(Long bookId);

    BookFormatResponse getBookFormatById(Long bookId, Long bookFormatId);

    BookFormatResponse createBookFormat(Long bookId, BookFormatCreateRequest request);

    BookFormatResponse updateBookFormat(Long bookId, Long bookFormatId, BookFormatUpdateRequest request);

    void deleteBookFormat(Long bookId, Long bookFormatId);
}
