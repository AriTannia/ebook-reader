package com.aritan.ebook_reader.features.order.utilities;

import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.common.models.cart.Cart;
import com.aritan.ebook_reader.common.models.cart.CartItem;
import com.aritan.ebook_reader.common.models.order.Order;
import com.aritan.ebook_reader.common.models.order.OrderItem;
import com.aritan.ebook_reader.features.order.dtos.OrderAdminResponse;
import com.aritan.ebook_reader.features.order.dtos.OrderItemResponse;
import com.aritan.ebook_reader.features.order.dtos.OrderResponse;
import com.aritan.ebook_reader.features.order.dtos.OrderUserResponse;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "remainingSeconds", ignore = true)
    OrderResponse toResponse(Order order);

    @Mapping(target = "bookId", source = "book.bookId")
    OrderItemResponse toItemResponse(OrderItem orderItem);

    @Mapping(target = "orderId", ignore = true)
    @Mapping(target = "items", source = "items")
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "paidAt", ignore = true)
    Order toEntity(Cart cart);

    @AfterMapping
    default void setTotalAmount(Cart cart, @MappingTarget Order order){
        order.setTotalAmount(calculateTotalAmount(cart));
    }

    @Mapping(target = "orderItemId", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "bookTitleSnapshot", source = "book.title")
    @Mapping(target = "priceSnapshot", source = "book.price")
    OrderItem toEntity(CartItem item);

    @Mapping(target = "user", source = "user")
    OrderAdminResponse toAdminResponse(Order order);

    default BigDecimal calculateTotalAmount(Cart cart) {
        return cart.getItems().stream()
                .map(item -> item.getBook()
                        .getPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    default OrderUserResponse toUserResponse(User user) {
        OrderUserResponse response = new OrderUserResponse();

        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());

        return response;
    }

    @AfterMapping
    default void setRemainingSeconds(Order order, @MappingTarget OrderResponse response) {
        if (order.getPaymentExpiresAt() != null) {
            long seconds = Duration.between(LocalDateTime.now(), order.getPaymentExpiresAt()).getSeconds();
            response.setRemainingSeconds(Math.max(0, seconds));
        }
    }
}
