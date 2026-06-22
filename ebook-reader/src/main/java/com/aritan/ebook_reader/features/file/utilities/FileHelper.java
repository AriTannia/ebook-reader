package com.aritan.ebook_reader.features.file.utilities;

import static java.util.UUID.randomUUID;

public class FileHelper {
    public static String buildFileName(String originalFileName){
        if(originalFileName == null || originalFileName.contains(".")){
            return randomUUID().toString();
        }

        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));

        return randomUUID().toString() + extension;
    }
}
