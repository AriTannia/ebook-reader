package com.aritan.ebook_reader.common.constants.messages;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class BookMessage {
    // Success messages
    public static final String BOOKS_RETRIEVED_SUCCESSFULLY =
            "Books retrieved successfully!";

    public static final String BOOK_CREATED_SUCCESSFULLY =
            "Book created successfully!";

    public static final String BOOK_RETRIEVED_SUCCESSFULLY =
            "Book with id %d retrieved successfully!";

    public static final String BOOK_UPDATED_SUCCESSFULLY =
            "Book with id %d updated successfully!";

    public static final String BOOK_DELETED_SUCCESSFULLY =
            "Book with id %d deleted successfully!";

    // Error messages
    public static final String BOOK_NOT_FOUND =
            "Book not found with id: %d";
}
