package com.aritan.ebook_reader.common.constants.messages;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class BookFormatMessage {
    // Success messages
    public static final String BOOK_FORMATS_RETRIEVED_SUCCESSFULLY =
            "Book formats for book with id %d retrieved successfully!";

    public static final String BOOK_FORMAT_RETRIEVED_SUCCESSFULLY =
            "Book format with id %d retrieved successfully for book with id %d!";

    public static final String BOOK_FORMAT_CREATED_SUCCESSFULLY =
            "Book format created successfully for book with id %d!";

    public static final String BOOK_FORMAT_UPDATED_SUCCESSFULLY =
            "Book format with id %d updated successfully for book with id %d!";

    public static final String BOOK_FORMAT_DELETED_SUCCESSFULLY =
            "Book format with id %d deleted successfully for book with id %d!";

    // Error messages
    public static final String BOOK_FORMAT_NOT_FOUND =
            "Book format not found with id: %d";
}
