package com.aritan.ebook_reader.features.cart.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    public Long cartId;
    public List<CartItemResponse> items;
    public BigDecimal totalPrice;
}
