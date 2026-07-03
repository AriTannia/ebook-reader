package com.aritan.ebook_reader.common.constants.tables.book;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class TagTableConstants {
    // Table
    public static final String TABLE_NAME = "tags";
    public static final String SCHEMA = "public";

    // Columns
    public static final String TAG_ID = "tag_id";
    public static final String NAME = "tag_name";
    public static final String CREATED_AT = "createdAt";
}
