package com.aritan.ebook_reader.common.constants.messages;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class FileMessage {
    public static final String PRESIGNED_URL_GENERATED_SUCCESSFULLY = "Pre-signed URL generated successfully";
    public static final String UNSUPPORTED_HTTP_METHOD =
            "Unsupported HTTP method for presigned URL generation: %s";
}
