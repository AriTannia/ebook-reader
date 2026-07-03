package com.aritan.ebook_reader.common.constants.tables.book;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class BookFormatTableConstants {
    // Table
    public static final String TABLE_NAME = "book_formats";
    public static final String SCHEMA = "public";

    // Columns
    public static final String BOOK_FORMAT_ID = "book_format_id";
    public static final String BOOK_ID = "book_id";
    public static final String FORMAT_TYPE = "format_type";
    public static final String STORAGE_URL = "storage_url";
    public static final String MIME_TYPE = "mime_type";
    public static final String FILE_SIZE = "file_size";
    public static final String IS_PRIMARY = "is_primary";
    public static final String CREATED_AT = "created_at";
}
