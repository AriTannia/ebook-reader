package com.aritan.ebook_reader.config.scheduler;

import com.aritan.ebook_reader.common.enums.order.OrderStatus;
import com.aritan.ebook_reader.common.models.order.Order;
import com.aritan.ebook_reader.features.order.repositories.IOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OrderExpirationJob {
    private final IOrderRepository orderRepository;

    @Scheduled(fixedRate = 60_000) // Run every minute
    @Transactional
    public void expireOverdueOrders() {
        List<Order> overdue = orderRepository
                .findAllByStatusAndPaymentExpiresAtBefore(
                        OrderStatus.PENDING,
                        LocalDateTime.now()
                );
        overdue.forEach(order -> order.setStatus(OrderStatus.EXPIRED));
        orderRepository.saveAll(overdue);
    }
}
