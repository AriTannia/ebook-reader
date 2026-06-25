package com.aritan.ebook_reader.common.constants.messages;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class TagMessage {
    // Success messages
    public static final String TAG_CREATED_SUCCESSFULLY =
            "Tag created successfully!";

    public static final String TAG_RETRIEVED_SUCCESSFULLY =
            "Tag retrieved successfully!";

    public static final String TAG_UPDATED_SUCCESSFULLY =
            "Tag updated successfully!";

    public static final String TAG_DELETED_SUCCESSFULLY =
            "Tag deleted successfully!";

    // Error messages
    public static final String TAG_NOT_FOUND =
            "Tag not found";

    public static final String SOME_TAGS_NOT_FOUND =
            "Some tags were not found!";
}
