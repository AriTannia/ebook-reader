package com.aritan.ebook_reader.common.constants.messages;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class CategoryMessage {
    // Success messages
    public static final String CATEGORIES_RETRIEVED_SUCCESSFULLY =
            "Categories retrieved successfully!";

    public static final String CATEGORY_CREATED_SUCCESSFULLY =
            "Category created successfully!";

    public static final String CATEGORY_RETRIEVED_SUCCESSFULLY =
            "Category with id %d retrieved successfully!";

    public static final String CATEGORY_UPDATED_SUCCESSFULLY =
            "Category with id %d updated successfully!";

    public static final String CATEGORY_DELETED_SUCCESSFULLY =
            "Category with id %d deleted successfully!";

    // Error messages
    public static final String CATEGORY_NOT_FOUND =
            "Category not found with id: %d";
    public static final String SOME_CATEGORIES_NOT_FOUND =
            "Some categories were not found!";
}
