package com.aritan.ebook_reader.features.payment;

import com.aritan.ebook_reader.common.enums.order.OrderStatus;
import com.aritan.ebook_reader.common.enums.payment.PaymentProvider;
import com.aritan.ebook_reader.common.enums.payment.PaymentStatus;
import com.aritan.ebook_reader.common.exception.InvalidRequestException;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.order.Order;
import com.aritan.ebook_reader.common.models.payment.Payment;
import com.aritan.ebook_reader.features.auth.IAuthService;
import com.aritan.ebook_reader.features.order.IOrderRepository;
import com.aritan.ebook_reader.features.payment.dtos.PaymentInitResponse;
import com.aritan.ebook_reader.features.payment.dtos.PaymentResponse;
import com.aritan.ebook_reader.features.payment.dtos.PaymentVerifyResult;
import com.aritan.ebook_reader.features.payment.gateway.PaymentGateway;
import com.aritan.ebook_reader.features.payment.gateway.factory.PaymentGatewayFactory;
import com.aritan.ebook_reader.features.payment.utilities.PaymentMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService implements IPaymentService{
    private final IPaymentRepository paymentRepository;
    private final IOrderRepository orderRepository;
    private final PaymentMapper paymentMapper;
    private final IAuthService authService;
    private final PaymentGatewayFactory gatewayFactory;

    @Override
    @Transactional
    public PaymentInitResponse initiatePayment(Long orderId, PaymentProvider provider, HttpServletRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        Payment payment = paymentMapper.toEntity(order, provider);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setProviderTxnRef(UUID.randomUUID().toString());

        paymentRepository.save(payment);

        PaymentGateway gateway = gatewayFactory.getGateWay(provider);
        String paymentUrl = gateway.createPaymentUrl(payment, request);

        return new PaymentInitResponse(payment.getPaymentId(), paymentUrl);
    }

    @Override
    public void handleCallback(PaymentProvider provider, Map<String, String> params) {
        PaymentGateway gateway = gatewayFactory.getGateWay(provider);
        gateway.verifyCallback(params);
    }

    @Override
    @Transactional
    public void handleIpn(PaymentProvider provider, Map<String, String> params) {
        PaymentGateway gateway = gatewayFactory.getGateWay(provider);
        PaymentVerifyResult result = gateway.verifyCallback(params);

        if(!result.isValid()){
            throw new InvalidRequestException("Invalid IPN request for provider: " + provider);
        }

        Payment payment = paymentRepository.findByProviderTxnRef(result.getProviderTxnRef())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with provider transaction reference: "
                                        + result.getProviderTxnRef()));

        paymentMapper.toEntity(result, payment);

        if(result.isSuccess()){
            payment.setStatus(PaymentStatus.SUCCESS);
            Order order = payment.getOrder();
            order.setStatus(OrderStatus.PAID);
            order.setPaidAt(LocalDateTime.now());
            orderRepository.save(order);
        }
        else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        paymentRepository.save(payment);
    }

    @Override
    public List<PaymentResponse> getPaymentsByOrderId(Long orderId) {
        return paymentRepository.findAllByOrder_OrderId(orderId).stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable).map(paymentMapper::toResponse);
    }
}
