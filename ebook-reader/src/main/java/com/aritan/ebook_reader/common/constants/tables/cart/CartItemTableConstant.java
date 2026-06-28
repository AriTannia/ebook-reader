package com.aritan.ebook_reader.common.constants.tables.cart;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class CartItemTableConstant {
    // Table
    public static final String TABLE_NAME = "cart_items";
    public static final String SCHEMA = "public";

    // Columns
    public static final String CART_ITEM_ID = "cart_item_id";
    public static final String QUANTITY = "quantity";
    public static final String ADDED_AT = "added_at";
}
