package com.aritan.ebook_reader.common.constants.messages.book;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class AuthorMessage {
    // Success messages
    public static final String AUTHORS_RETRIEVED_SUCCESSFULLY =
            "Authors retrieved successfully!";

    public static final String AUTHOR_CREATED_SUCCESSFULLY =
            "Author created successfully!";

    public static final String AUTHOR_RETRIEVED_SUCCESSFULLY =
            "Author with id %d retrieved successfully!";

    public static final String AUTHOR_UPDATED_SUCCESSFULLY =
            "Author with id %d updated successfully!";

    public static final String AUTHOR_DELETED_SUCCESSFULLY =
            "Author with id %d deleted successfully!";

    // Error messages
    public static final String AUTHOR_NOT_FOUND =
            "Author not found with id: %d";
    public static final String SOME_AUTHORS_NOT_FOUND =
            "Some authors were not found!";
}
