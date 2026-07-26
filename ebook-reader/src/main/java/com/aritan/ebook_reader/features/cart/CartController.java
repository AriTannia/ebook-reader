package com.aritan.ebook_reader.features.cart;

import com.aritan.ebook_reader.common.constants.messages.cart.CartMessage;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.auth.IAuthService;
import com.aritan.ebook_reader.features.cart.dtos.CartAddItemRequest;
import com.aritan.ebook_reader.features.cart.dtos.CartResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cart")
public class CartController {
    private final ICartService cartService;
    private final IAuthService authService;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<CartResponse>> getCartByUserId() {
        User user = authService.getCurrentUser();
        var result = cartService.getCartByUserId(user);

        return ResponseEntity.ok(EBResponse.Success(result, CartMessage.CART_RETRIEVED_SUCCESSFULLY));
    }

    @PostMapping("/items")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<CartResponse>> addItemToCart(
            @RequestBody CartAddItemRequest addItemRequest){
        User user = authService.getCurrentUser();
        var result = cartService.addItemToCart(user.getUserId(), addItemRequest);

        return ResponseEntity.ok(EBResponse.Success(result, CartMessage.CART_ITEM_ADDED_SUCCESSFULLY));
    }

    @DeleteMapping("items/{cartItemId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<CartResponse>> removeItemFromCart(
            @PathVariable Long cartItemId){
        User user = authService.getCurrentUser();

        var result = cartService.removeItemFromCart(user.getUserId(), cartItemId);
        return ResponseEntity.ok(EBResponse.Success(result, CartMessage.CART_ITEM_REMOVED_SUCCESSFULLY));
    }

    @DeleteMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<?>> clearCart(){
        User user = authService.getCurrentUser();

        cartService.clearCart(user.getUserId());
        return ResponseEntity.ok(EBResponse.Success(null, CartMessage.CART_CLEARED_SUCCESSFULLY));
    }
}
