package com.aritan.ebook_reader.features.cart;

import com.aritan.ebook_reader.features.cart.dtos.CartAddItemRequest;
import com.aritan.ebook_reader.features.cart.dtos.CartResponse;

public interface ICartService {
    CartResponse getCartByUserId();
    CartResponse addItemToCart(CartAddItemRequest addItemRequest);
    CartResponse removeItemFromCart(Long cartItemId);
    void clearCart();
}
