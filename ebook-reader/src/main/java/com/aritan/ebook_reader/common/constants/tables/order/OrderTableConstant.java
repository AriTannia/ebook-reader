package com.aritan.ebook_reader.common.constants.tables.order;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class OrderTableConstant {
    // Table
    public static final String TABLE_NAME = "orders";
    public static final String SCHEMA = "public";

    public static final String ORDER = "order";

    // Columns
    public static final String ORDER_ID = "order_id";
    public static final String STATUS = "status"; // PENDING, PAID, FAILED, CANCELLED
    public static final String TOTAL_AMOUNT = "total_amount";
    public static final String PAYMENT_EXPIRES_AT = "payment_expires_at";

    public static final String CREATED_AT = "created_at";
    public static final String PAID_AT = "paid_at";
}
