package com.aritan.ebook_reader.features.cart;

import com.aritan.ebook_reader.common.exception.DataDuplicateException;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.Book;
import com.aritan.ebook_reader.common.models.User;
import com.aritan.ebook_reader.common.models.cart.Cart;
import com.aritan.ebook_reader.common.models.cart.CartItem;
import com.aritan.ebook_reader.features.auth.IAuthService;
import com.aritan.ebook_reader.features.book.IBookRepository;
import com.aritan.ebook_reader.features.cart.cartItem.ICartItemRepository;
import com.aritan.ebook_reader.features.cart.dtos.CartAddItemRequest;
import com.aritan.ebook_reader.features.cart.dtos.CartResponse;
import com.aritan.ebook_reader.features.cart.utilities.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService{
    private final ICartRepository cartRepository;
    private final ICartItemRepository cartItemRepository;
    private final IBookRepository bookRepository;
    private final IAuthService authService;
    private final CartMapper cartMapper;
    @Override
    public CartResponse getCartByUserId() {
        User user = authService.getCurrentUser();
        Long userId = user.getUserId();

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart not found for user with ID: " + userId));

        return cartMapper.toCarResponse(cart);
    }

    @Override
    public CartResponse addItemToCart(CartAddItemRequest addItemRequest) {
        User user = authService.getCurrentUser();
        Long userId = user.getUserId();
        Long bookId = addItemRequest.getBookId();

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user with ID: " + userId));

        CartItem existedItem = cartItemRepository.findByCart_CartIdAndBook_BookId(cart.getCartId(), bookId)
                .orElse(null);

        if(existedItem == null){
            Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + bookId));

            CartItem newItem = cartMapper.toEntity(cart, book);
            cartItemRepository.save(newItem);

            cart.getItems().add(newItem);
            cartRepository.save(cart);

            return cartMapper.toCarResponse(cart);
        }

        throw new DataDuplicateException("Book with ID: "
                + bookId
                + " already exists in the cart for user with ID: "
                + userId);
    }

    @Override
    public void removeItemFromCart(Long cartItemId) {
        User user = authService.getCurrentUser();
        Long userId = user.getUserId();

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user with ID: " + userId));

        cart.getItems().stream()
                .map(CartItem::getCartItemId)
                .filter(id -> id.equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        cartItemRepository.deleteByCart_CartId(cart.getCartId());
    }

    @Override
    public void clearCart() {
        User user = authService.getCurrentUser();
        Long userId = user.getUserId();

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user with ID: " + userId));

        cartItemRepository.deleteByCart_CartId(cart.getCartId());
    }
}
