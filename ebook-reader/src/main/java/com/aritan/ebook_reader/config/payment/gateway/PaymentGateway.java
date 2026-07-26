package com.aritan.ebook_reader.config.payment.gateway;

import com.aritan.ebook_reader.common.enums.payment.PaymentProvider;
import com.aritan.ebook_reader.common.models.payment.Payment;
import com.aritan.ebook_reader.config.payment.gateway.dtos.PaymentVerifyResult;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface PaymentGateway {
    PaymentProvider getProvider();
    String createPaymentUrl(Payment payment, HttpServletRequest request);
    PaymentVerifyResult verifyCallback(Map<String, String> params);
}
