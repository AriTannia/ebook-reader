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

    // Error messages
    public static final String REVIEW_NOT_FOUND =
            "Review not found with id: %s";
}
