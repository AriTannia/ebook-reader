package com.aritan.ebook_reader.common.constants.tables;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class PublisherTableConstants {
    // Table
    public static final String TABLE_NAME = "publishers";
    public static final String SCHEMA = "public";

    // Columns
    public static final String PUBLISHER_ID = "publisher_id";
    public static final String PUBLISHER_NAME = "publisher_name";
    public static final String LOGO_URL = "logo_url";
    public static final String CREATED_AT = "created_at";
}
