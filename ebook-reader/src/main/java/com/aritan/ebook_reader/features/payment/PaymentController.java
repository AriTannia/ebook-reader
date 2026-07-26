package com.aritan.ebook_reader.features.payment;

import com.aritan.ebook_reader.common.constants.messages.payment.PaymentMessage;
import com.aritan.ebook_reader.common.enums.payment.PaymentProvider;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.payment.dtos.PaymentResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class PaymentController {
    private final IPaymentService paymentService;
    @PostMapping("/orders/{orderId}/payments")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Map<String, String>>> initiatePayment(
            @PathVariable Long orderId, @RequestParam PaymentProvider provider, HttpServletRequest request) {
        var result = paymentService.initiatePayment(orderId, provider, request);

        Map<String, String> response = new HashMap<>();
        response.put("paymentId", result.getPaymentId().toString());
        response.put("paymentUrl", result.getPaymentUrl());

        return ResponseEntity.ok(EBResponse.Success(response, PaymentMessage.PAYMENT_INITIATED_SUCCESSFULLY));
    }

    @GetMapping("/payments/vnpay/callback")
    public ResponseEntity<Void> vnpayCallback(@RequestParam Map<String, String> params) {
        paymentService.handleCallback(PaymentProvider.VNPAY, params);
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create("https://yourfrontend.com/payment-result?ref=" + params.get("vnp_TxnRef")))
                .build();
    }

    @PostMapping("/payments/vnpay/ipn")
    public ResponseEntity<Map<String, String>> vnpayIpn(@RequestParam Map<String, String> params) {
        paymentService.handleIpn(PaymentProvider.VNPAY, params);
        Map<String, String> response = new HashMap<>();
        response.put("RspCode", "00");
        response.put("Message", "Confirm Success");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders/me/{orderId}/payments")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<List<PaymentResponse>>> getPaymentsByOrderId(@PathVariable Long orderId) {
        var result = paymentService.getPaymentsByOrderId(orderId);
        return ResponseEntity.ok(EBResponse.Success(result, PaymentMessage.PAYMENTS_RETRIEVED_SUCCESSFULLY));
    }

    @GetMapping("/admin/payments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<PaymentResponse>>> getAllPayments(Pageable pageable) {
        var result = paymentService.getAllPayments(pageable);
        return ResponseEntity.ok(EBResponse.Success(result, PaymentMessage.PAYMENTS_RETRIEVED_SUCCESSFULLY));
    }

}
