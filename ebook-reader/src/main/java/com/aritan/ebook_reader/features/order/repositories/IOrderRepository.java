package com.aritan.ebook_reader.features.order.repositories;

import com.aritan.ebook_reader.common.enums.order.OrderStatus;
import com.aritan.ebook_reader.common.models.order.Order;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
public interface IOrderRepository extends
        JpaRepository<Order, Long>,
        JpaSpecificationExecutor<Order>,
        IOrderRepositoryCustom {

    @EntityGraph(attributePaths = {
            "items",
            "items.book"
    })
    Optional<Order> findByOrderIdAndUser_UserId(Long orderId, Long userId);
    @EntityGraph(attributePaths = {
            "items",
            "items.book"
    })
    List<Order> findAllByStatusAndPaymentExpiresAtBefore(OrderStatus status, LocalDateTime dateTime);

    @EntityGraph(attributePaths = {
            "items",
            "items.book"
    })
    Optional<Order> findByUser_UserIdAndStatus(Long userId, OrderStatus orderStatus);
    @EntityGraph(attributePaths = {
            "items",
            "items.book",
            "user"
    })
    boolean existsByItems_Book_BookIdAndUser_UserIdAndStatus(Long bookId, Long userId, OrderStatus status);
}
