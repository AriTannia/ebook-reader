package com.aritan.ebook_reader.common.constants;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class AuthMessages {
    public static final String INVALID_CREDENTIALS = "Invalid email or password!";
    public static final String REFRESH_TOKEN_NOT_FOUND = "Refresh token is not in database!";
    public static final String REFRESH_TOKEN_EMPTY = "Refresh Token is empty!";
    public static final String REFRESH_TOKEN_EXPIRED = "Refresh token was expired. Please make a new signin request";
}
