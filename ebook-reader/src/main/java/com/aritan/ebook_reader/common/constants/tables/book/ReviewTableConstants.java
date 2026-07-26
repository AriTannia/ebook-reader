package com.aritan.ebook_reader.common.constants.tables.book;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ReviewTableConstants {
    // Table
    public static final String TABLE_NAME = "reviews";
    public static final String SCHEMA = "public";

    // Columns
    public static final String REVIEW_ID = "review_id";
    public static final String RATING = "rating";
    public static final String COMMENT = "comment";
    public static final String HELPFUL_COUNT = "helpful_count";
    public static final String VERIFIED_PURCHASE = "verified_purchase";
    public static final String EDITED = "edited";
    public static final String CREATED_AT = "createdAt";
    public static final String UPDATED_AT = "updatedAt";
}
