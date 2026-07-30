package com.aritan.ebook_reader.features.payment.repositories;

import com.aritan.ebook_reader.common.models.payment.ProcessedPaymentEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IProcessedPaymentEventRepository extends JpaRepository<ProcessedPaymentEvent, Long> {

    @Modifying
    @Query(value = """
        INSERT INTO processed_payment_events (provider, provider_txn_ref, provider_transaction_id, processed_at)
        VALUES (:provider, :providerTxnRef, :providerTransactionId, now())
        ON CONFLICT (provider, provider_txn_ref, provider_transaction_id) DO NOTHING
        """, nativeQuery = true)
    int markEventAsProcessed(
            @Param("provider") String provider,
            @Param("providerTxnRef") String providerTxnRef,
            @Param("providerTransactionId") String providerTransactionId
    );
}
