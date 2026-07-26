package com.aritan.ebook_reader.common.constants.tables.book;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserLibraryTableConstants {
    // Table
    public static final String TABLE_NAME = "user_libraries";
    public static final String SCHEMA = "public";
    // Columns
    public static final String USER_LIBRARY_ID = "user_library_id";
    public static final String ACCESS_STATUS = "access_status";
    public static final String IS_FAVORITE = "is_favorite";
    public static final String ACQUIRED_AT = "acquired_at";
}
