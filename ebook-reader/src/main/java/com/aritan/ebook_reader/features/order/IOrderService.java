package com.aritan.ebook_reader.features.order;

import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.order.dtos.OrderAdminResponse;
import com.aritan.ebook_reader.features.order.dtos.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IOrderService {
    OrderResponse checkout(User user);
    Page<OrderResponse> getMyOrders(Long userId, Pageable pageable);
    OrderResponse getMyOrderById(Long userId, Long orderId);
    OrderResponse cancelMyOrder(User user, Long orderId);

    Page<OrderAdminResponse> getAllOrders(Pageable pageable);
    OrderResponse getOrderByIdForAdmin(Long orderId);
    OrderResponse cancelOrderByAdmin(Long orderId);
    OrderResponse refundOrder(Long orderId);
}
