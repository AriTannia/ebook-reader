package com.aritan.ebook_reader.common.constants.messages.library;

import lombok.NoArgsConstructor;

import java.util.Locale;

@NoArgsConstructor
public class BookContentMessage {
    // Success
    public static final String BOOK_CONTENT_RETRIEVED_SUCCESSFULLY = "Book content retrieved successfully.";
    public static final String BOOK_FORMAT_RETRIEVED_SUCCESSFULLY = "Book format retrieved successfully.";
    // Error
    public static final String PDF_STREAM_ONLY =
            "Book %s is a PDF, use stream endpoint instead";

    public static final String TOO_MANY_REQUESTS =
            "Too many requests for user %s. Please try again later.";
    public static final String USER_ACCESS_DENIED = "User %s does not have access to book %s.";
    public static final String PRIMARY_FORMAT_NOT_FOUND = "Primary format not found for book %s.";
    public static final String BOOK_FORMAT_NOT_FOUND = "Book format not found for book %s and format type %s.";

}
