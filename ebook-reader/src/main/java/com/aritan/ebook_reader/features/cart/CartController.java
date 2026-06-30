package com.aritan.ebook_reader.features.cart;

import com.aritan.ebook_reader.common.models.EBResponse;
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

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<CartResponse>> getCartByUserId() {
        var result = cartService.getCartByUserId();

        return ResponseEntity.ok(EBResponse.Success(result, "Cart retrieved successfully"));
    }

    @PostMapping("/items")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<CartResponse>> addItemToCart(
            @RequestBody CartAddItemRequest addItemRequest){
        var result = cartService.addItemToCart(addItemRequest);

        return ResponseEntity.ok(EBResponse.Success(result, "Item added to cart successfully"));
    }

    @DeleteMapping("items/{cartItemId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<CartResponse>> removeItemToCart(
            @PathVariable Long cartItemId){

        var result = cartService.removeItemFromCart(cartItemId);
        return ResponseEntity.ok(EBResponse.Success(result, "Item removed from cart successfully"));
    }

    @DeleteMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<?>> clearCart(){

        cartService.clearCart();
        return ResponseEntity.ok(EBResponse.Success(null, "Cart cleared successfully"));
    }
}
