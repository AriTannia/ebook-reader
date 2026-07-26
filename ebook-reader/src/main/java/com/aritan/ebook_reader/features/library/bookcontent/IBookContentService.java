package com.aritan.ebook_reader.features.library.bookcontent;

import com.aritan.ebook_reader.features.library.dtos.BookContentFormatResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;

public interface IBookContentService {
    void streamPdf(Long userId, Long bookId, HttpHeaders requestHeaders, HttpServletResponse response);
    String getDirectContentUrl(Long userId, Long bookId);
    BookContentFormatResponse getBookFormatForReading(Long userId, Long bookId);
}
