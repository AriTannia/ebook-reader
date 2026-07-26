package com.aritan.ebook_reader.common.constants.tables.token;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PasswordResetTokenTableConstants {
    // Table
    public static final String TABLE_NAME = "password_reset_tokens";
    public static final String SCHEMA = "public";

    // Columns
    public static final String PASSWORD_RESET_TOKEN_ID = "password_reset_token_id";
    public static final String USER_ID = "user_id";
    public static final String TOKEN = "token";
    public static final String EXPIRY_DATE = "expiry_date";
}
