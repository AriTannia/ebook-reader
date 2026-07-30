package com.aritan.ebook_reader.features.payment.repositories;

import com.aritan.ebook_reader.common.models.payment.Payment;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPaymentRepository extends JpaRepository<Payment, Long> {
    @EntityGraph(attributePaths = {"order"})
    List<Payment> findAllByOrder_OrderId(Long orderId);

    @EntityGraph(attributePaths = {"order"})
    Optional<Payment> findByProviderTxnRef(String providerTxnRef);

    @NonNull
    @EntityGraph(attributePaths = {"order"})
    Page<Payment> findAll(@NonNull  Pageable pageable);
}
