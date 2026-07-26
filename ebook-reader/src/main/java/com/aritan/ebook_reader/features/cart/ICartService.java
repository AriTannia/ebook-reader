package com.aritan.ebook_reader.features.cart;

import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.cart.dtos.CartAddItemRequest;
import com.aritan.ebook_reader.features.cart.dtos.CartResponse;

public interface ICartService {
    CartResponse getCartByUserId(User user);
    CartResponse addItemToCart(Long userId, CartAddItemRequest addItemRequest);
    CartResponse removeItemFromCart(Long userId, Long cartItemId);
    void clearCart(Long userId);
}
