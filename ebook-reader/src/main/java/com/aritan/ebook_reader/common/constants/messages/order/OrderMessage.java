package com.aritan.ebook_reader.common.constants.messages.order;

import lombok.NoArgsConstructor;

import java.util.Locale;

@NoArgsConstructor
public class OrderMessage {
    // Success
    public static final String ORDER_CREATED_SUCCESSFULLY = "Order created successfully";
    public static final String ORDER_RETRIEVED_SUCCESSFULLY = "Order retrieved successfully";
    public static final String ORDER_CANCELLED_SUCCESSFULLY = "Order cancelled successfully";
    public static final String ORDER_REFUNDED_SUCCESSFULLY = "Order refunded successfully";
    // Error
    public static final String ORDER_NOT_FOUND = "Order not found with id: %d";
    public static final String ORDER_NOT_FOUND_AND_USER_ID = "Order not found with id: %d and user id: %d";
    public static final String ORDER_CANNOT_CANCELLED = "Order cannot be cancelled";
    public static final String ORDER_CANNOT_CANCELLED_DETAILS = "Only PENDING orders can be cancelled. Use refund for PAID orders.";
    public static final String BOOK_ALREADY_IN_PENDING_ORDER = "Book with id: %d is already in a pending order for user with id: %d";
}
