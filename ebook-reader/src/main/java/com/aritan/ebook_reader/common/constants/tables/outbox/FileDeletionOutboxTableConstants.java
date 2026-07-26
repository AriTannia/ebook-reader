package com.aritan.ebook_reader.common.constants.tables.outbox;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class FileDeletionOutboxTableConstants {
    // Table
    public static final String TABLE_NAME = "file_deletion_outbox";
    public static final String SCHEMA = "public";
    // Columns
    public static final String FILE_DELETION_OUTBOX_ID = "file_deletion_outbox_id";
    public static final String FILE_URL = "file_url";
    public static final String SOURCE_TYPE = "source_type";
    public static final String SOURCE_ENTITY_ID = "source_entity_id";
    public static final String STATUS = "status";
    public static final String RETRY_COUNT = "retry_count";
    public static final String MAX_RETRIES = "max_retries";
    public static final String ERROR_MESSAGE = "error_message";
    public static final String CREATED_AT = "created_at";
    public static final String UPDATED_AT = "updated_at";
    public static final String DELETED_AT = "deleted_at";
    public static final String NEXT_RETRY_AT = "next_retry_at";
}
