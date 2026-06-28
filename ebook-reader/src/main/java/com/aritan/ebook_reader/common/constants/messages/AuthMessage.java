package com.aritan.ebook_reader.common.constants.messages;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class AuthMessage {
    // Success
    public static final String SIGN_IN_SUCCESSFUL = "Sign in successful!";
    public static final String SIGN_UP_SUCCESSFUL = "Sign up successful!";
    public static final String SIGN_OUT_SUCCESSFUL = "Sign out successful!";
    public static final String TOKEN_REFRESHED_SUCCESSFULLY = "Token refreshed successfully!";

    public static final String CURRENT_USER_RETRIEVED_SUCCESSFULLY = "Current user retrieved successfully!";

    // Error
    public static final String INVALID_CREDENTIALS = "Invalid email or password!";
    public static final String REFRESH_TOKEN_NOT_FOUND = "Refresh token is not in database!";
    public static final String REFRESH_TOKEN_EMPTY = "Refresh Token is empty!";
    public static final String REFRESH_TOKEN_EXPIRED = "Refresh token was expired. Please make a new signin request";
    public static final String ACCESS_TOKEN_EMPTY = "Access Token is empty!";
    public static final String ACCESS_TOKEN_EXPIRED = "Access token was expired. Please make a new signin request";
    public static final String ACCESS_TOKEN_INVALID = "Access token is invalid!";
}
