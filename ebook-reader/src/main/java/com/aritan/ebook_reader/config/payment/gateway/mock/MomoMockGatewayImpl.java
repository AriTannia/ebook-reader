package com.aritan.ebook_reader.config.payment.gateway.mock;

import com.aritan.ebook_reader.common.enums.payment.PaymentProvider;
import com.aritan.ebook_reader.common.models.payment.Payment;
import com.aritan.ebook_reader.config.payment.gateway.PaymentGateway;
import com.aritan.ebook_reader.config.payment.gateway.dtos.PaymentVerifyResult;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@Profile("mock-payment")
public class MomoMockGatewayImpl implements PaymentGateway {
    @Override
    public PaymentProvider getProvider() {
        return PaymentProvider.MOMO;
    }

    @Override
    public String createPaymentUrl(Payment payment, HttpServletRequest request) {
        return "https://mock-payment.local/momopay?orderId=" + payment.getProviderTxnRef();
    }

    @Override
    public PaymentVerifyResult verifyCallback(Map<String, String> params) {
        return PaymentVerifyResult.builder()
                .valid(true)
                .success(true)
                .providerTxnRef(params.get("orderId"))
                .providerTransactionId("MOCK-MOMO-" + UUID.randomUUID())
                .responseCode("0")
                .rawResponseJson("{\"mock\": \"response\"}")
                .build();
    }
}
