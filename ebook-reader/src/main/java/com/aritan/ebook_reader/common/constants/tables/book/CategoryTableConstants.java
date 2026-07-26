package com.aritan.ebook_reader.common.constants.tables.book;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CategoryTableConstants {
    // Table
    public static final String TABLE_NAME = "categories";
    public static final String SCHEMA = "public";

    // Columns
    public static final String CATEGORY_ID = "category_id";
    public static final String CATEGORY_NAME = "category_name";
    public static final String DESCRIPTION = "description";
    public static final String SLUG = "slug";
    public static final String CREATED_AT = "created_at";
}
