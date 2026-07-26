package com.aritan.ebook_reader.common.constants.tables.outbox;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class EmailOutboxTableConstants {

    // Table
    public static final String TABLE_NAME = "email_outbox";
    public static final String SCHEMA = "public";

    // Columns
    public static final String EMAIL_OUTBOX_ID = "email_outbox_id";
    public static final String TO_EMAIL = "to_email";
    public static final String TEMPLATE_TYPE = "template_type";
    public static final String PAYLOAD = "payload";
    public static final String STATUS = "status";
    public static final String RETRY_COUNT = "retry_count";
    public static final String MAX_RETRIES = "max_retries";
    public static final String ERROR_MESSAGE = "error_message";
    public static final String CREATED_AT = "created_at";
    public static final String UPDATED_AT = "updated_at";
    public static final String SENT_AT = "sent_at";
    public static final String NEXT_RETRY_AT = "next_retry_at";
}
