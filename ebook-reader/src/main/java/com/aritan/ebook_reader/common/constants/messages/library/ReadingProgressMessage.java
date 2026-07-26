package com.aritan.ebook_reader.common.constants.messages.library;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ReadingProgressMessage {
    // Success
    public static final String READING_PROGRESS_SAVED_SUCCESSFULLY = "Reading progress saved successfully";
    public static final String RECENTLY_READ_BOOKS_RETRIEVED_SUCCESSFULLY = "Recently read books retrieved successfully";
    public static final String BOOK_MARKED_AS_FINISHED = "Book marked as finished";
    // Error
    public static final String READING_PROGRESS_NOT_FOUND =
            "Reading progress not found for userId: %s and bookId: %s";
}
