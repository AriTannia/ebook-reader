package com.aritan.ebook_reader.features.order;

import com.aritan.ebook_reader.common.constants.messages.order.OrderMessage;
import com.aritan.ebook_reader.common.enums.order.OrderStatus;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.auth.IAuthService;
import com.aritan.ebook_reader.features.order.dtos.OrderAdminResponse;
import com.aritan.ebook_reader.features.order.dtos.OrderFilterRequest;
import com.aritan.ebook_reader.features.order.dtos.OrderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final IOrderService orderService;
    private final IAuthService authService;

    // Public
    @PostMapping("/checkout")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<OrderResponse>> createMyOrder() {
        User user = authService.getCurrentUser();

        var result = orderService.checkout(user);
        return ResponseEntity.ok(EBResponse.Success(result, OrderMessage.ORDER_CREATED_SUCCESSFULLY));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<OrderResponse>>> getMyOrders(
            OrderFilterRequest request,
            Pageable pageable) {
        User user = authService.getCurrentUser();

        var result = orderService.getMyOrders(user.getUserId(), request, pageable);
        return ResponseEntity.ok(EBResponse.Success(result, OrderMessage.ORDER_RETRIEVED_SUCCESSFULLY));
    }

    @GetMapping("/me/{orderId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<OrderResponse>> getMyOrderById(@PathVariable Long orderId) {
        User user = authService.getCurrentUser();
        var result = orderService.getMyOrderById(user.getUserId(), orderId);

        return ResponseEntity.ok(EBResponse.Success(result, OrderMessage.ORDER_RETRIEVED_SUCCESSFULLY));
    }

    @PatchMapping("/me/{orderId}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<OrderResponse>> cancelMyOrder(@PathVariable Long orderId) {
        User user = authService.getCurrentUser();
        var result = orderService.cancelMyOrder(user, orderId);

        return ResponseEntity.ok(EBResponse.Success(result, OrderMessage.ORDER_CANCELLED_SUCCESSFULLY));
    }

    // Admin
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<OrderAdminResponse>>> getAllOrders(
            OrderFilterRequest request, Pageable pageable) {
        var result = orderService.getAllOrders(request, pageable);

        return ResponseEntity.ok(EBResponse.Success(result, OrderMessage.ORDER_RETRIEVED_SUCCESSFULLY));
    }

    @GetMapping("/admin/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<OrderResponse>> getOrderByIdForAdmin(@PathVariable Long orderId) {
        var result = orderService.getOrderByIdForAdmin(orderId);

        return ResponseEntity.ok(EBResponse.Success(result, OrderMessage.ORDER_RETRIEVED_SUCCESSFULLY));
    }

    @PatchMapping("/admin/{orderId}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<OrderResponse>> cancelOrderByAdmin(@PathVariable Long orderId) {
        var result = orderService.cancelOrderByAdmin(orderId);

        return ResponseEntity.ok(EBResponse.Success(result, OrderMessage.ORDER_CANCELLED_SUCCESSFULLY));
    }

    @PatchMapping("/admin/{orderId}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<OrderResponse>> refundOrder(@PathVariable Long orderId) {
        var result = orderService.refundOrder(orderId);

        return ResponseEntity.ok(EBResponse.Success(result, OrderMessage.ORDER_REFUNDED_SUCCESSFULLY));
    }
}
