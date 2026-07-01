package com.aritan.ebook_reader.features.order.utilities;

import com.aritan.ebook_reader.common.models.User;
import com.aritan.ebook_reader.common.models.cart.Cart;
import com.aritan.ebook_reader.common.models.cart.CartItem;
import com.aritan.ebook_reader.common.models.order.Order;
import com.aritan.ebook_reader.common.models.order.OrderItem;
import com.aritan.ebook_reader.features.order.dtos.OrderAdminResponse;
import com.aritan.ebook_reader.features.order.dtos.OrderItemResponse;
import com.aritan.ebook_reader.features.order.dtos.OrderResponse;
import com.aritan.ebook_reader.features.order.dtos.OrderUserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderResponse toResponse(Order order);

    @Mapping(target = "bookId", source = "book.bookId")
    OrderItemResponse toItemResponse(OrderItem orderItem);

    @Mapping(target = "orderId", ignore = true)
    @Mapping(target = "items", source = "items")
    @Mapping(target = "totalAmount", expression = "java(calculateTotalAmount(cart))")
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "paidAt", ignore = true)
    Order toEntity(Cart cart);

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
}
