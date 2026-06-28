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
}
