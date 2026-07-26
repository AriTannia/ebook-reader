package com.aritan.ebook_reader.features.file;

import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService implements IFileService {
    @Value("${ebook-reader.app.s3.public.bucketName}")
    private String publicBucketName;

    @Value("${ebook-reader.app.s3.private.bucketName}")
    private String privateBucketName;

    private final S3Presigner s3Presigner;
    private final S3Client s3Client;

    private static final long CHUNK_SIZE = 1024 * 1024;

    private String generatePresignedUrl(String bucketName, String filePath, Duration ttl) {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(filePath)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(ttl)
                .putObjectRequest(putObjectRequest)
                .build();

        return s3Presigner
                .presignPutObject(presignRequest)
                .url()
                .toString();
    }

    public String generateReadingPresignedUrl(String filePath, Duration ttl) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(privateBucketName)
                .key(filePath)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(ttl)
                .getObjectRequest(getObjectRequest)
                .build();

        return s3Presigner
                .presignGetObject(presignRequest)
                .url()
                .toString();
    }

    @Override
    public void streamWithRange(String filePath, HttpHeaders requestHeaders, HttpServletResponse response) {
        try {
            // Get metadata to define file size
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(publicBucketName)
                    .key(filePath)
                    .build();

            HeadObjectResponse headObjectResponse = s3Client.headObject(headObjectRequest);
            long totalSize = headObjectResponse.contentLength();

            // Parse Range header from client
            String rangeHeader = requestHeaders.getFirst(HttpHeaders.RANGE);
            long start = 0;
            long end = totalSize - 1;

            if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
                String[] parts = rangeHeader.substring("bytes=".length()).split("-");
                start = Long.parseLong(parts[0]);
                if (parts.length > 1 && !parts[1].isBlank()) {
                    end = Long.parseLong(parts[1]);
                } else {
                    end = Math.min(start + CHUNK_SIZE - 1, totalSize - 1);
                }
            }

            long contentLength = end - start + 1;

            // Call GetObject with suitable range to S3
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(privateBucketName)
                    .key(filePath)
                    .range("bytes=%d-%d".formatted(start, end))
                    .build();

            try (ResponseInputStream<GetObjectResponse> s3Stream = s3Client.getObject(getObjectRequest)) {
                // Set response headers
                response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
                response.setHeader(HttpHeaders.ACCEPT_RANGES, "bytes");
                response.setHeader(HttpHeaders.CONTENT_RANGE, "bytes %d-%d/%d".formatted(start, end, totalSize));

                response.setContentType(headObjectResponse.contentType() != null
                        ? headObjectResponse.contentType() : MediaType.APPLICATION_PDF_VALUE);
                response.setContentLengthLong(contentLength);

                // Stream live
                StreamUtils.copy(s3Stream, response.getOutputStream());
                response.flushBuffer();

            }
        } catch (NoSuchKeyException e) {
            throw new ResourceNotFoundException("File not found in S3: " + filePath);
        } catch (IOException e) {
            log.debug("Error streaming file from S3: {}", filePath, e);
        } catch (S3Exception e) {
            log.error("Error retrieving file from S3: {}", filePath, e);
            throw new RuntimeException("Error retrieving file from S3: " + filePath, e);
        }
    }

    @Override
    public String generatePublicPresignedUrl(String filePath) {
        return generatePresignedUrl(publicBucketName, filePath, Duration.ofMinutes(60));
    }
    @Override
    public String generatePrivatePresignedUrl(String filePath, Duration ttl) {
        return generatePresignedUrl(privateBucketName, filePath, ttl);
    }


    @Override
    public void deleteFile(String filePath){
        DeleteObjectRequest request = software.amazon.awssdk.services.s3.model.DeleteObjectRequest.builder()
                .bucket(publicBucketName)
                .key(filePath)
                .build();

        s3Client.deleteObject(request);
    }
}
