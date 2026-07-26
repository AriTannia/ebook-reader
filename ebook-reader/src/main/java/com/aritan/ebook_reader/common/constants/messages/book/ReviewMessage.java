package com.aritan.ebook_reader.common.constants.messages.book;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ReviewMessage {
    // Success messages
    public static final String REVIEWS_RETRIEVED_SUCCESSFULLY =
            "Reviews retrieved successfully!";

    public static final String REVIEW_CREATED_SUCCESSFULLY =
            "Review created successfully!";

    public static final String REVIEW_RETRIEVED_SUCCESSFULLY =
            "Review with id %s retrieved successfully!";

    public static final String REVIEW_UPDATED_SUCCESSFULLY =
            "Review with id %s updated successfully!";

    public static final String REVIEW_DELETED_SUCCESSFULLY =
            "Review with userId %s deleted successfully!";

    public static final String REVIEW_STATS_RETRIEVED_SUCCESSFULLY =
            "Review stats retrieved successfully!";

    // Error messages
    public static final String REVIEW_NOT_FOUND =
            "Review not found with id: %s";
    public static final String REVIEW_ALREADY_EXISTS =
            "Review already exists for this book by the current user.";
    public static final String NOT_ALLOWED =
            "You are not allowed to perform this action.";
}
