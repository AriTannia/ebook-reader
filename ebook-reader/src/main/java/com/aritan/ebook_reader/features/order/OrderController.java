package com.aritan.ebook_reader.features.order;

import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.order.dtos.OrderAdminResponse;
import com.aritan.ebook_reader.features.order.dtos.OrderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final IOrderService orderService;

    // Public
    @PostMapping("/checkout")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<OrderResponse>> createMyOrder() {
        var result = orderService.checkout();

        return ResponseEntity.ok(EBResponse.Success(result, "Order created successfully"));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<OrderResponse>>> getMyOrders(Pageable pageable) {
        var result = orderService.getMyOrders(pageable);

        return ResponseEntity.ok(EBResponse.Success(result, "Order retrieved successfully"));
    }

    @GetMapping("/me/{orderId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<OrderResponse>> getMyOrderById(@PathVariable Long orderId) {
        var result = orderService.getMyOrderById(orderId);

        return ResponseEntity.ok(EBResponse.Success(result, "Order retrieved successfully"));
    }

    @PatchMapping("/me/{orderId}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<OrderResponse>> cancelMyOrder(@PathVariable Long orderId) {
        var result = orderService.cancelMyOrder(orderId);

        return ResponseEntity.ok(EBResponse.Success(result, "Order cancelled successfully"));
    }

    // Admin
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<OrderAdminResponse>>> getAllOrders(Pageable pageable) {
        var result = orderService.getAllOrders(pageable);

        return ResponseEntity.ok(EBResponse.Success(result, "Order retrieved successfully"));
    }

    @GetMapping("/admin/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<OrderResponse>> getOrderByIdForAdmin(@PathVariable Long orderId) {
        var result = orderService.getOrderByIdForAdmin(orderId);

        return ResponseEntity.ok(EBResponse.Success(result, "Order retrieved successfully"));
    }

    @PatchMapping("/admin/{orderId}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<OrderResponse>> cancelOrderByAdmin(@PathVariable Long orderId) {
        var result = orderService.cancelOrderByAdmin(orderId);

        return ResponseEntity.ok(EBResponse.Success(result, "Order cancelled successfully"));
    }

    @PatchMapping("/admin/{orderId}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<OrderResponse>> refundOrder(@PathVariable Long orderId) {
        var result = orderService.refundOrder(orderId);

        return ResponseEntity.ok(EBResponse.Success(result, "Order refunded successfully"));
    }
}
