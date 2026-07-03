package com.aritan.ebook_reader.common.constants.messages.user;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public  final class UserMessage {
    public static final String DATA_SUCCESS = "Data retrieved successfully";
    public static final String NO_DATA_FOUND =  "No data found";
    public static final String DATA_CREATED_SUCCESSFULLY = "Data created successfully";
    public static final String EMAIL_IN_USE = "Email is already in use!";
    public static final String ROLE_NOT_FOUND = "Role is not found.";
    public static final String DATA_UPDATED_SUCCESSFULLY = "Data updated successfully!";
    public static final String INVALID_ROLE_FORMAT = "Định dạng quyền (Role) không hợp lệ hoặc không tồn tại!";
    public static final String USER_NOT_FOUND_WITH_EMAIL =
            "User not found with email: %s";

    // Validation Input
    public static final String FULL_NAME_EMPTY = "Full name cannot be empty!";
    public static final String FULL_NAME_SIZE = "Full name must be between 2 and 50 characters long!";
    public static final String EMAIL_EMPTY = "Email address cannot be empty!";
    public static final String EMAIL_INVALID = "Invalid email format!";
    public static final String PASSWORD_EMPTY = "Password cannot be empty!";
    public static final String PASSWORD_SIZE = "Password must be between 6 and 40 characters long!";
    public static final String DATA_DELETED_SUCCESSFULLY = "Data deleted successfully!";
}
