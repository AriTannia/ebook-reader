package com.aritan.ebook_reader.features.file;

import software.amazon.awssdk.http.SdkHttpMethod;

public interface IFileService {
    String generatePresignedUrl(String filePath, SdkHttpMethod method);
}
