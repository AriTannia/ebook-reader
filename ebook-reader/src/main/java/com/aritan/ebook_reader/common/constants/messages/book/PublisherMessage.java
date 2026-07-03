package com.aritan.ebook_reader.common.constants.messages.book;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class PublisherMessage {
    // Success messages
    public static final String PUBLISHERS_RETRIEVED_SUCCESSFULLY =
            "Publishers retrieved successfully!";

    public static final String PUBLISHER_CREATED_SUCCESSFULLY =
            "Publisher created successfully!";

    public static final String PUBLISHER_RETRIEVED_SUCCESSFULLY =
            "Publisher with id %d retrieved successfully!";

    public static final String PUBLISHER_UPDATED_SUCCESSFULLY =
            "Publisher with id %d updated successfully!";

    public static final String PUBLISHER_DELETED_SUCCESSFULLY =
            "Publisher with id %d deleted successfully!";

    // Error messages
    public static final String PUBLISHER_NOT_FOUND =
            "Publisher not found with id: %d";
}
