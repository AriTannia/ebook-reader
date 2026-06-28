package com.aritan.ebook_reader.features.payment.gateway.factory;

import com.aritan.ebook_reader.common.enums.payment.PaymentProvider;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.features.payment.gateway.PaymentGateway;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PaymentGatewayFactory {
    private final Map<PaymentProvider, PaymentGateway> paymentGateways;

    public PaymentGatewayFactory(List<PaymentGateway> gatewayList){
        this.paymentGateways = gatewayList.stream()
                .collect(Collectors.toMap(
                        PaymentGateway::getProvider,
                        Function.identity()
                ));
    }

    public PaymentGateway getGateWay(PaymentProvider provider){
        PaymentGateway gateway = paymentGateways.get(provider);

        if (gateway == null) {
            throw new ResourceNotFoundException("No payment gateway found for provider: " + provider);
        }

        return gateway;
    }
}
