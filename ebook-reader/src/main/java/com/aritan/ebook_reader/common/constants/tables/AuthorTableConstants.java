package com.aritan.ebook_reader.common.constants.tables;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class AuthorTableConstants {
    // Table
    public static final String TABLE_NAME = "authors";
    public static final String SCHEMA = "public";

    // Columns
    public static final String AUTHOR_ID = "author_id";
    public static final String AUTHOR_NAME = "author_name";
    public static final String AVATAR_URL = "avatar_url";
    public static final String BIOGRAPHY = "biography";
    public static final String CREATED_AT = "created_at";
}
