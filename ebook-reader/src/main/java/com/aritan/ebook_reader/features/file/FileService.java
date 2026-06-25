package com.aritan.ebook_reader.features.file;

import com.aritan.ebook_reader.common.constants.messages.FileMessage;
import com.aritan.ebook_reader.common.exception.UnsupportedOperationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.http.SdkHttpMethod;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class FileService implements IFileService {
    @Value("${ebook-reader.app.s3.bucketName}")
    private String bucketName;

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    private String generateGetPresignedUrl(String filePath) {

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(filePath)
                .build();

        // Expiration Time
        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(60))
                .getObjectRequest(getObjectRequest)
                .build();

        PresignedGetObjectRequest presignedGetObjectRequest = s3Presigner.presignGetObject(presignRequest);
        return presignedGetObjectRequest.url().toString();
    }

    private String generatePutPresignedUrl(String filePath){
        PutObjectRequest.Builder putObjectRequestBuilder = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(filePath);

        PutObjectRequest putObjectRequest = putObjectRequestBuilder.build();
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(60))
                .putObjectRequest(putObjectRequest)
                .build();

        PresignedPutObjectRequest presignedPutObjectRequest = s3Presigner.presignPutObject(presignRequest);
        return presignedPutObjectRequest.url().toString();
    }

    @Override
    public String generatePresignedUrl(String filePath, SdkHttpMethod method) {
        if(method == SdkHttpMethod.GET){
            return generateGetPresignedUrl(filePath);
        } else if(method == SdkHttpMethod.PUT){
            return generatePutPresignedUrl(filePath);
        } else{
            throw new UnsupportedOperationException(
                    String.format(FileMessage.UNSUPPORTED_HTTP_METHOD, method)
            );
        }
    }
}
