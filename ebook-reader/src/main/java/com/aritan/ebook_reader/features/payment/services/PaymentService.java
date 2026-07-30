package com.aritan.ebook_reader.features.payment.services;

import com.aritan.ebook_reader.common.constants.messages.order.OrderMessage;
import com.aritan.ebook_reader.common.constants.messages.payment.PaymentMessage;
import com.aritan.ebook_reader.common.enums.order.OrderStatus;
import com.aritan.ebook_reader.common.enums.payment.PaymentProvider;
import com.aritan.ebook_reader.common.enums.payment.PaymentStatus;
import com.aritan.ebook_reader.common.exception.InvalidRequestException;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.order.Order;
import com.aritan.ebook_reader.common.models.payment.Payment;
import com.aritan.ebook_reader.features.cart.ICartRepository;
import com.aritan.ebook_reader.features.library.IUserLibraryService;
import com.aritan.ebook_reader.features.library.readinghistory.IReadingProgressService;
import com.aritan.ebook_reader.features.order.repositories.IOrderRepository;
import com.aritan.ebook_reader.features.payment.repositories.IPaymentRepository;
import com.aritan.ebook_reader.features.payment.IPaymentService;
import com.aritan.ebook_reader.features.payment.dtos.PaymentInitResponse;
import com.aritan.ebook_reader.features.payment.dtos.PaymentResponse;
import com.aritan.ebook_reader.config.payment.gateway.dtos.PaymentVerifyResult;
import com.aritan.ebook_reader.config.payment.gateway.PaymentGateway;
import com.aritan.ebook_reader.config.payment.gateway.factory.PaymentGatewayFactory;
import com.aritan.ebook_reader.features.payment.repositories.IProcessedPaymentEventRepository;
import com.aritan.ebook_reader.features.payment.utilities.PaymentMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
public class PaymentService implements IPaymentService {
    private final IPaymentRepository paymentRepository;
    private final IOrderRepository orderRepository;
    private final IProcessedPaymentEventRepository processedPaymentEventRepository;
    private final ICartRepository cartRepository;
    private final PaymentMapper paymentMapper;
    private final PaymentGatewayFactory gatewayFactory;
    private final IUserLibraryService userLibraryService;
    private final IReadingProgressService readingProgressService;

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Override
    @Transactional
    public PaymentInitResponse initiatePayment(Long orderId, PaymentProvider provider, HttpServletRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(OrderMessage.ORDER_NOT_FOUND, orderId)));

        if(order.getStatus() != OrderStatus.PENDING){
            throw new InvalidRequestException(
                    String.format(PaymentMessage.ORDER_NOT_PENDING, orderId, order.getStatus()));
        }

        if(order.getPaymentExpiresAt().isBefore(LocalDateTime.now())){
            order.setStatus(OrderStatus.EXPIRED);
            orderRepository.save(order);
            throw new InvalidRequestException(
                    String.format(PaymentMessage.ORDER_PAYMENT_EXPIRED, orderId));
        }

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
            throw new InvalidRequestException(
                    String.format(PaymentMessage.INVALID_IPN_REQUEST, provider));
        }

        int inserted = processedPaymentEventRepository.markEventAsProcessed(
                provider.name(),
                result.getProviderTxnRef(),
                result.getProviderTransactionId());

        if(inserted == 0){
            logger.info("Duplicate IPN event received for provider: {}, providerTxnRef: {}, providerTransactionId: {}. Ignoring.",
                    provider, result.getProviderTxnRef(), result.getProviderTransactionId());

            return;
        }

        Payment payment = paymentRepository.findByProviderTxnRef(result.getProviderTxnRef())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                String.format(
                                        PaymentMessage.PAYMENT_NOT_FOUND, result.getProviderTxnRef())));

        paymentMapper.toEntity(result, payment);
        payment.setCompletedAt(LocalDateTime.now());

        if(result.isSuccess()){
            handleOrderPaymentSuccess(payment);
        }
        else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        paymentRepository.save(payment);
    }

    private void handleOrderPaymentSuccess(Payment payment) {
        Order order = payment.getOrder();
        order.setStatus(OrderStatus.PAID);
        order.setPaidAt(LocalDateTime.now());
        orderRepository.save(order);

        order.getItems().forEach(
                item -> userLibraryService.addBookToUserLibrary(order.getUser(), item));
        order.getItems().forEach(
                item -> readingProgressService.createReadingProgress(order.getUser(), item));
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
