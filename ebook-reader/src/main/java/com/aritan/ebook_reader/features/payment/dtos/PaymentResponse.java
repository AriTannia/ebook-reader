package com.aritan.ebook_reader.features.payment.dtos;

import com.aritan.ebook_reader.common.enums.payment.PaymentProvider;
import com.aritan.ebook_reader.common.enums.payment.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long paymentId;
    private PaymentProvider provider;
    private PaymentStatus status;
    private BigDecimal amount;
    private String providerTransactionId;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
