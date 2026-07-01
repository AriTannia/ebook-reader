package com.aritan.ebook_reader.features.file.utilities;

import java.util.UUID;

public class FileHelper {

    public static String buildAvatarFileName(String originalFileName) {

        if (originalFileName == null || !originalFileName.contains(".")) {
            return "avatars/" + UUID.randomUUID();
        }

        String extension =
                originalFileName.substring(originalFileName.lastIndexOf("."));

        return "avatars/" + UUID.randomUUID() + extension;
    }

    public static String buildBookFileName(String originalFileName){
        if (originalFileName == null || !originalFileName.contains(".")) {
            return "books/" + UUID.randomUUID();
        }

        String extension =
                originalFileName.substring(originalFileName.lastIndexOf("."));

        return "books/" + UUID.randomUUID() + extension;
    }

    public static String buildBookFormatFileName(String originalFileName){
        if (originalFileName == null || !originalFileName.contains(".")) {
            return "book-formats/" + UUID.randomUUID();
        }

        String extension =
                originalFileName.substring(originalFileName.lastIndexOf("."));

        return "book-formats/" + UUID.randomUUID() + extension;
    }
}
