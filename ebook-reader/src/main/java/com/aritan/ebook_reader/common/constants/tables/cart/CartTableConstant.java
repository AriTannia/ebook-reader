package com.aritan.ebook_reader.common.constants.tables.cart;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CartTableConstant {
    // Table
    public static final String TABLE_NAME = "carts";
    public static final String SCHEMA = "public";

    public static final String CART = "cart";

    // Columns
    public static final String CART_ID = "cart_id";
    public static final String CREATED_AT = "created_at";
    public static final String UPDATED_AT = "updated_at";
}
