package com.aritan.ebook_reader.features.file;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import java.time.Duration;

public interface IFileService {
    void streamWithRange(String filePath, HttpHeaders requestHeaders, HttpServletResponse response);
    String generatePublicPresignedUrl(String filePath);
    String generatePrivatePresignedUrl(String filePath, Duration ttl);
    void deleteFile(String filePath);
}
