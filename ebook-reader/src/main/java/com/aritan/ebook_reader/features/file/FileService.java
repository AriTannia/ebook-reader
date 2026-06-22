package com.aritan.ebook_reader.features.file;

import com.aritan.ebook_reader.common.enums.AccessType;
import com.aritan.ebook_reader.common.exception.UnsupportedOperationException;
import com.aritan.ebook_reader.features.file.utilities.FileHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.http.SdkHttpMethod;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.io.InputStream;
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

    private String generatePutPresignedUrl(String filePath, AccessType accessType){
        PutObjectRequest.Builder putObjectRequestBuilder = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(filePath);

        if(accessType == AccessType.PUBLIC){
            putObjectRequestBuilder.acl(ObjectCannedACL.PUBLIC_READ);
        }

        PutObjectRequest putObjectRequest = putObjectRequestBuilder.build();
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(60))
                .putObjectRequest(putObjectRequest)
                .build();

        PresignedPutObjectRequest presignedPutObjectRequest = s3Presigner.presignPutObject(presignRequest);
        return presignedPutObjectRequest.url().toString();
    }

    @Override
    public String generatePresignedUrl(String filePath, SdkHttpMethod method, AccessType accessType) {
        if(method == SdkHttpMethod.GET){
            return generateGetPresignedUrl(filePath);
        } else if(method == SdkHttpMethod.PUT){
            return generatePutPresignedUrl(filePath, accessType);
        } else{
            throw new UnsupportedOperationException("Unsupported HTTP method for presigned URL generation: " + method);
        }
    }

    @Override
    public String uploadMultipartFile(MultipartFile file, AccessType accessType) {
        String fileName = FileHelper.buildFileName(file.getOriginalFilename());
        try(InputStream inputStream = file.getInputStream()){
            PutObjectRequest.Builder putObjectRequestBuilder = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName);

            if(accessType == AccessType.PUBLIC){
                putObjectRequestBuilder.acl(ObjectCannedACL.PUBLIC_READ);
            }

            PutObjectRequest putObjectRequest = putObjectRequestBuilder.build();
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage(), e);
        }
        return fileName;
    }

    @Override
    public ResponseInputStream<GetObjectResponse> downloadFile(String fileName) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build();

        return s3Client.getObject(getObjectRequest);
    }
}
