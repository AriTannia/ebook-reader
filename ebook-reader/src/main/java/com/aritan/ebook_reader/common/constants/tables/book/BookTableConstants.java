package com.aritan.ebook_reader.common.constants.tables.book;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class BookTableConstants {
    // Table
    public static final String TABLE_NAME = "books";
    public static final String SCHEMA = "public";

    // Columns
    public static final String BOOK_ID = "book_id";
    public static final String TITLE = "title";
    public static final String DESCRIPTION = "description";
    public static final String PRICE = "price";
    public static final String COVER_IMAGE_URL = "cover_image_url";
    public static final String LANGUAGE = "language";
    public static final String PUBLISHED_DATE = "published_date";
    public static final String STATUS = "status";
    public static final String BADGE = "badge";
    public static final String AVERAGE_RATING = "average_rating";
    public static final String REVIEW_COUNT = "review_count";
    public static final String SOLD_COPIES = "sold_copies";
    public static final String PUBLISHER_ID = "publisher_id";
    public static final String CREATED_AT = "created_at";

    // Join tables
    public static final String BOOK_AUTHORS_TABLE = "book_authors";
    public static final String BOOK_CATEGORIES_TABLE = "book_categories";
    public static final String BOOK_TAGS_TABLE = "book_tags";
}
