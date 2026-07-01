package com.aritan.ebook_reader.features.order;

import com.aritan.ebook_reader.common.models.order.Order;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IOrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {
            "items",
            "items.book"
    })
    Page<Order> findAllByUser_UserId(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {
            "items",
            "items.book"
    })
    Optional<Order> findByOrderIdAndUser_UserId(Long orderId, Long userId);

    @EntityGraph(attributePaths = {
            "items",
            "items.book",
            "user"
    })
    @NonNull
    Page<Order> findAll(@NonNull Pageable pageable);
}
