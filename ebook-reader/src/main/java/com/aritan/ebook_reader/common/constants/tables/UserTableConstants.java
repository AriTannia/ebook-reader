package com.aritan.ebook_reader.common.constants.tables;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class UserTableConstants {
    // Table
    public static final String TABLE_NAME = "users";
    public static final String SCHEMA = "public";

    // Columns
    public static final String USER_ID = "user_id";
    public static final String EMAIL = "email";
    public static final String PASSWORD_HASH = "password_hash";
    public static final String AVATAR_URL = "avatar_url";
    public static final String FULL_NAME = "full_name";
    public static final String CREATED_AT = "created_at";

    // Join table
    public static final String USER_ROLES_TABLE = "user_roles";
}
