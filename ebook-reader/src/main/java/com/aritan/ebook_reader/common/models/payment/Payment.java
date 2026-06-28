package com.aritan.ebook_reader.common.models.payment;

import com.aritan.ebook_reader.common.constants.tables.order.OrderTableConstant;
import com.aritan.ebook_reader.common.constants.tables.payment.PaymentTableConstant;
import com.aritan.ebook_reader.common.enums.payment.PaymentProvider;
import com.aritan.ebook_reader.common.enums.payment.PaymentStatus;
import com.aritan.ebook_reader.common.models.order.Order;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = PaymentTableConstant.TABLE_NAME, schema = PaymentTableConstant.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = PaymentTableConstant.PAYMENT_ID, updatable = false, nullable = false)
    private Long paymentId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = OrderTableConstant.ORDER_ID, nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = PaymentTableConstant.PROVIDER, nullable = false)
    private PaymentProvider provider; // VNPAY, MOMO, STRIPE,...

    @Enumerated(EnumType.STRING)
    @Column(name = PaymentTableConstant.STATUS, nullable = false)
    private PaymentStatus status; // PENDING, SUCCESS, FAILED

    @Column(name = PaymentTableConstant.AMOUNT, nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = PaymentTableConstant.PROVIDER_TXN_REF)
    private String providerTxnRef;

    @Column(name = PaymentTableConstant.PROVIDER_TRANSACTION_ID)
    private String providerTransactionId;

    @Column(name = PaymentTableConstant.RESPONSE_CODE)
    private String responseCode;

    @Column(name = PaymentTableConstant.RESPONSE_MESSAGE)
    private String responseMessage;

    @Column(name = PaymentTableConstant.RAW_RESPONSE_JSON, columnDefinition = "TEXT")
    private String rawResponseJson;

    @CreatedDate
    @Column(name = PaymentTableConstant.CREATED_AT, updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Column(name = PaymentTableConstant.COMPLETED_AT)
    private LocalDateTime completedAt;
}
