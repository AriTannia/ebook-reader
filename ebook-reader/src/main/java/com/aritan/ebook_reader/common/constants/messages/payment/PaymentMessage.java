package com.aritan.ebook_reader.common.constants.messages.payment;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class PaymentMessage {
    
    // Success
    public static final String PAYMENT_INITIATED_SUCCESSFULLY = "Payment initiated successfully";
    public static final String PAYMENTS_RETRIEVED_SUCCESSFULLY = "Payments retrieved successfully";
    // Error
    public static final String INVALID_IPN_REQUEST = "Invalid IPN request for provider: %s";
    public static final String PAYMENT_NOT_FOUND = "Payment not found with provider transaction reference: %s";
    public static final String PAYMENT_VNPAY_INITIATED_FAILED = "Failed to initiate VNPay payment";
    public static final String ERROR_GENERATE_HMAC = "Error while generating HMAC SHA512";
    public static final String PAYMENT_GATEWAY_NOT_FOUND = "Payment gateway not found for provider: %s";
    public static final String PAYMENT_NOT_FOUND_WITH_ID = "Payment not found with ID: %d";
    public static final String UNSUPPORTED_PAYMENT_PROVIDER = "Unsupported payment provider: %s";
    public static final String PAYMENT_MOMO_INITIATED_FAILED = "Failed to initiate Momo payment";
    public static final String ERROR_CALL_PAYMENT_GATEWAY = "Error occurred while calling payment gateway";
    public static final String ORDER_NOT_PENDING = "Order with ID %d is not in PENDING status, current status: %s";
    public static final String ORDER_PAYMENT_EXPIRED = "Order with ID %d has expired payment";
}
