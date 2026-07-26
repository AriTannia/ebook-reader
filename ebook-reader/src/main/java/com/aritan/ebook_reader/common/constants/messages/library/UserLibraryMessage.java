package com.aritan.ebook_reader.common.constants.messages.library;

import lombok.NoArgsConstructor;

import java.util.Locale;

@NoArgsConstructor
public class UserLibraryMessage {
    // Success
    public static final String USER_LIBRARY_RETRIEVED_SUCCESSFULLY = "User library retrieved successfully";
    public static final String USER_LIBRARY_ACCESS_CHECKED_SUCCESSFULLY = "User library access checked successfully";
    public static final String USER_LIBRARY_FAVORITE_TOGGLED_SUCCESSFULLY = "User library favorite status toggled successfully";
    public static final String USER_LIBRARY_ACCESS_REVOKED_SUCCESSFULLY = "User library access revoked successfully";
    // Error
    public static final String USER_LIBRARY_ENTRY_NOT_FOUND =
            "User library entry not found for userId: %s and bookId: %s";
    public static final String BOOK_ALREADY_IN_LIBRARY = "Book already exists in user library for userId: %s and bookId: %s";
}
