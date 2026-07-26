package com.aritan.ebook_reader.features.payment.utilities;

import com.aritan.ebook_reader.common.enums.payment.PaymentProvider;
import com.aritan.ebook_reader.common.models.order.Order;
import com.aritan.ebook_reader.common.models.payment.Payment;
import com.aritan.ebook_reader.features.payment.dtos.PaymentResponse;
import com.aritan.ebook_reader.config.payment.gateway.dtos.PaymentVerifyResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    PaymentResponse toResponse(Payment payment);

    @Mapping(target = "paymentId", ignore = true)
    @Mapping(target = "order", source = "order")
    @Mapping(target = "provider", source = "provider")
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "amount", source = "order.totalAmount")
    @Mapping(target = "providerTxnRef", ignore = true)
    @Mapping(target = "providerTransactionId", ignore = true)
    @Mapping(target = "responseCode", ignore = true)
    @Mapping(target = "responseMessage", ignore = true)
    @Mapping(target = "rawResponseJson", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "completedAt", ignore = true)
    Payment toEntity(Order order, PaymentProvider provider);

    @Mapping(target = "paymentId", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "provider", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "amount", ignore = true)
    @Mapping(target = "providerTxnRef", ignore = true)
    @Mapping(target = "responseMessage", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "completedAt", ignore = true)
    void toEntity(PaymentVerifyResult result,
                  @MappingTarget Payment payment);
}
