package com.aritan.ebook_reader.common.constants.tables.payment;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ProcessedPaymentEventTableConstant {
    // Table
    public static final String TABLE_NAME = "processed_payment_events";
    public static final String SCHEMA = "public";

    // Columns
    public static final String PROCESSED_PAYMENT_EVENT_ID = "processed_payment_event_id";
    public static final String PROVIDER = "provider";
    public static final String PROVIDER_TXN_REF = "provider_txn_ref";
    public static final String PROVIDER_TRANSACTION_ID = "provider_transaction_id";
    public static final String PROCESSED_AT = "processed_at";
}
