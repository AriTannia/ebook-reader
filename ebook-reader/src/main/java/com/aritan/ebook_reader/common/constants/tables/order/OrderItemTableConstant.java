package com.aritan.ebook_reader.common.constants.tables.order;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class OrderItemTableConstant {
    // Table
    public static final String TABLE_NAME = "order_items";
    public static final String SCHEMA = "public";

    // Columns
    public static final String ORDER_ITEM_ID = "order_item_id";
    public static final String BOOK_TITLE_SNAPSHOT = "book_title_snapshot";
    public static final String PRICE_SNAPSHOT = "price_snapshot";
    public static final String QUANTITY = "quantity";
}
