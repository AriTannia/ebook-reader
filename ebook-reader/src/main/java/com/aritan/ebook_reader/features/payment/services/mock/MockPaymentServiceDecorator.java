package com.aritan.ebook_reader.features.payment.services.mock;

import com.aritan.ebook_reader.common.constants.messages.payment.PaymentMessage;
import com.aritan.ebook_reader.common.enums.payment.PaymentProvider;
import com.aritan.ebook_reader.common.exception.IllegalStateException;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.payment.Payment;
import com.aritan.ebook_reader.features.payment.repositories.IPaymentRepository;
import com.aritan.ebook_reader.features.payment.IPaymentService;
import com.aritan.ebook_reader.features.payment.dtos.PaymentInitResponse;
import com.aritan.ebook_reader.features.payment.dtos.PaymentResponse;
import com.aritan.ebook_reader.features.payment.services.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Primary
@RequiredArgsConstructor
@Profile("mock-payment")
public class MockPaymentServiceDecorator implements IPaymentService {
    private final PaymentService delegate;
    private final IPaymentRepository repository;
    @Override
    public PaymentInitResponse initiatePayment(Long orderId, PaymentProvider provider, HttpServletRequest request) {
        PaymentInitResponse response = delegate.initiatePayment(orderId, provider, request);

        Payment payment = repository.findById(response.getPaymentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(PaymentMessage.PAYMENT_NOT_FOUND_WITH_ID, response.getPaymentId())));

        handleIpn(provider, buildFakeParams(provider, payment.getProviderTxnRef()));

        return response;
    }

    @Override
    public void handleCallback(PaymentProvider provider, Map<String, String> params) {
        delegate.handleCallback(provider, params);
    }

    @Override
    public void handleIpn(PaymentProvider provider, Map<String, String> params) {
        delegate.handleIpn(provider, params);
    }

    @Override
    public List<PaymentResponse> getPaymentsByOrderId(Long orderId) {
        return delegate.getPaymentsByOrderId(orderId);
    }

    @Override
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        return delegate.getAllPayments(pageable);
    }

    private Map<String, String> buildFakeParams(PaymentProvider provider, String txnRef) {
        return switch (provider) {
            case VNPAY -> Map.of("vnp_TxnRef", txnRef, "vnp_ResponseCode", "00");
            case MOMO -> Map.of("orderId", txnRef, "resultCode", "0");
            default -> throw new IllegalStateException(
                    String.format(PaymentMessage.UNSUPPORTED_PAYMENT_PROVIDER, provider)
            );
        };
    }
}
