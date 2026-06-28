package com.aritan.ebook_reader.features.cart.utilities;

import com.aritan.ebook_reader.common.models.Book;
import com.aritan.ebook_reader.common.models.cart.Cart;
import com.aritan.ebook_reader.common.models.cart.CartItem;
import com.aritan.ebook_reader.common.models.order.Order;
import com.aritan.ebook_reader.common.models.order.OrderItem;
import com.aritan.ebook_reader.features.book.utilities.BookMapper;
import com.aritan.ebook_reader.features.cart.dtos.CartItemResponse;
import com.aritan.ebook_reader.features.cart.dtos.CartResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;

@Mapper(
        componentModel = "spring",
        uses = {BookMapper.class}
)
public interface CartMapper {
    @Mapping(target = "totalPrice", expression = "java(calculateTotalPrice(cart))")
    CartResponse toCarResponse(Cart cart);

    @Mapping(target = "book", source = "book")
    CartItemResponse toCarItemResponse(CartItem cartItem);

    @Mapping(target = "cartItemId", ignore = true)
    @Mapping(target = "quantity", ignore = true)
    @Mapping(target = "addedAt", ignore = true)
    CartItem toEntity(Cart cart, Book book);

    default BigDecimal calculateTotalPrice(Cart cart) {
        return cart.getItems().stream()
                .map(item -> item.getBook()
                        .getPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
