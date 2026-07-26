package com.aritan.ebook_reader.common.constants.tables.payment;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PaymentTableConstant {
    // Table
    public static final String TABLE_NAME = "payments";
    public static final String SCHEMA = "public";

    // Columns
    public static final String PAYMENT_ID = "payment_id";

    // Payment info
    public static final String PROVIDER = "provider";
    public static final String STATUS = "status";
    public static final String AMOUNT = "amount";

    // Gateway transaction info
    public static final String PROVIDER_TXN_REF = "provider_txn_ref";
    public static final String PROVIDER_TRANSACTION_ID = "provider_transaction_id";
    public static final String RESPONSE_CODE = "response_code";
    public static final String RESPONSE_MESSAGE = "response_message";
    public static final String RAW_RESPONSE_JSON = "raw_response_json";

    public static final String CREATED_AT = "created_at";
    public static final String COMPLETED_AT = "completed_at";
}
