package com.aritan.ebook_reader.features.payment;

import com.aritan.ebook_reader.common.enums.payment.PaymentProvider;
import com.aritan.ebook_reader.features.payment.dtos.PaymentInitResponse;
import com.aritan.ebook_reader.features.payment.dtos.PaymentResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface IPaymentService {
    PaymentInitResponse initiatePayment(Long orderId, PaymentProvider provider, HttpServletRequest request);

    void handleCallback(PaymentProvider provider, Map<String, String> params);
    void handleIpn(PaymentProvider provider, Map<String, String> params);

    List<PaymentResponse> getPaymentsByOrderId(Long orderId);
    Page<PaymentResponse> getAllPayments(Pageable pageable);
}
