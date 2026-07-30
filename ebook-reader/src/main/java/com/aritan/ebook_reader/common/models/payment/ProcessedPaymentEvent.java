package com.aritan.ebook_reader.common.models.payment;

import com.aritan.ebook_reader.common.constants.tables.payment.ProcessedPaymentEventTableConstant;
import com.aritan.ebook_reader.common.enums.payment.PaymentProvider;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = ProcessedPaymentEventTableConstant.TABLE_NAME, schema = ProcessedPaymentEventTableConstant.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProcessedPaymentEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = ProcessedPaymentEventTableConstant.PROCESSED_PAYMENT_EVENT_ID, updatable = false, nullable = false)
    private Long processedPaymentEventId;

    @Enumerated(EnumType.STRING)
    @Column(name = ProcessedPaymentEventTableConstant.PROVIDER, nullable = false)
    private PaymentProvider provider;

    @Column(name = ProcessedPaymentEventTableConstant.PROVIDER_TXN_REF, nullable = false)
    private String providerTxnRef;

    @Column(name = ProcessedPaymentEventTableConstant.PROVIDER_TRANSACTION_ID, nullable = false)
    private String providerTransactionId;

    @CreatedDate
    @Column(name = ProcessedPaymentEventTableConstant.PROCESSED_AT, updatable = false, nullable = false)
    private LocalDateTime processedAt;
}
