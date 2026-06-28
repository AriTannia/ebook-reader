package com.aritan.ebook_reader.features.cart;

import com.aritan.ebook_reader.features.cart.dtos.CartAddItemRequest;
import com.aritan.ebook_reader.features.cart.dtos.CartResponse;

public interface ICartService {
    CartResponse getCartByUserId();
    CartResponse addItemToCart(CartAddItemRequest addItemRequest);
    void removeItemFromCart(Long cartItemId);
    void clearCart();
}
