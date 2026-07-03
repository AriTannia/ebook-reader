package com.aritan.ebook_reader.features.library.bookcontent;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;

public interface IBookContentService {
    void streamPdf(Long userId, Long bookId, HttpHeaders requestHeaders, HttpServletResponse response);
    String getDirectContentUrl(Long userId, Long bookId);
}
