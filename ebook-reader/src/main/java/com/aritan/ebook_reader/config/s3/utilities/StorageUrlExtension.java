package com.aritan.ebook_reader.config.s3.utilities;

import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class StorageUrlExtension {
    @Value("${ebook-reader.app.s3.public.bucketName}")
    private String bucketName;
    @Value("${ebook-reader.app.s3.publicBaseUrl}")
    private String publicBaseUrl;

    @Named("getPublicUrl")
    public String getPublicUrl(String filePath) {
        if(filePath == null || filePath.isBlank())
            return null;

        return publicBaseUrl + "/" + bucketName + "/" + filePath;
    }
}
