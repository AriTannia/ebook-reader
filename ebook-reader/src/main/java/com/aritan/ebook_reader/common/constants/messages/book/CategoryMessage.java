package com.aritan.ebook_reader.common.constants.messages.book;

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
    public static final String IS_HAS_BOOKS_ASSIGNED =
            "Category with id %d has books assigned to it and cannot be deleted!";
    public static final String IS_CATEGORY_ALREADY_EXIST =
            "Category with %s is already exists!";
    public static final String IS_SLUG_ALREADY_EXIST = "Slug %s already exists";
    public static final String DUPLICATE_CATEGORY_NAME_REQUEST = "Duplicate category %s in request: ";
    public static final String DUPLICATE_SLUG_NAME_REQUEST = "Duplicate slug %s in request: ";
}
