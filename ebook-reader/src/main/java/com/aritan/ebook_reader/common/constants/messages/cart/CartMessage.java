package com.aritan.ebook_reader.common.constants.messages.cart;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class CartMessage {
    // Success
    public static final String CART_RETRIEVED_SUCCESSFULLY = "Cart retrieved successfully";
    public static final String CART_ITEM_ADDED_SUCCESSFULLY = "Item added to cart successfully";
    public static final String CART_ITEM_REMOVED_SUCCESSFULLY = "Item removed from cart successfully";
    public static final String CART_CLEARED_SUCCESSFULLY = "Cart cleared successfully";
    // Error
    public static final String CART_NOT_FOUND_USER_ID = "Cart not found for user with ID: %s";
    public static final String CART_ITEM_ALREADY_EXISTS = 
            "Book with ID: %s already exists in the cart for user with ID: %s";

    public static final String CART_ITEM_NOT_FOUND = "Cart item not found with ID: %s";
    public static final String CART_IS_EMPTY = "Cart is empty. Please add items to the cart before proceeding to checkout.";
    public static final String CART_CREATION_CONFLICT_UNRESOLVED =
            "Cart creation conflict unresolved for user with ID: %s. Please try again later.";
}
