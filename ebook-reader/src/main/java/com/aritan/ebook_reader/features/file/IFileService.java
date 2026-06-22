package com.aritan.ebook_reader.features.file;

import com.aritan.ebook_reader.common.enums.AccessType;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.http.SdkHttpMethod;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

public interface IFileService {
    String generatePresignedUrl(String filePath, SdkHttpMethod method, AccessType accessType);
    String uploadMultipartFile(MultipartFile file, AccessType accessType);
    ResponseInputStream<GetObjectResponse> downloadFile(String fileName);
}
