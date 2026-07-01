package com.aritan.ebook_reader.features.cart;

import com.aritan.ebook_reader.common.exception.DataDuplicateException;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.Book;
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
import org.springframework.transaction.annotation.Transactional;

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
                .orElse(null);

        if(cart == null){
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepository.save(cart);
        }

        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addItemToCart(CartAddItemRequest addItemRequest) {
        User user = authService.getCurrentUser();
        Long userId = user.getUserId();
        Long bookId = addItemRequest.getBookId();

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user with ID: " + userId));

        boolean existedItem = cartItemRepository.existsByCart_CartIdAndBook_BookId(cart.getCartId(), bookId);

        if(!existedItem){
            Book book = bookRepository.findByBookId(bookId)
                    .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + bookId));

            CartItem newItem = cartMapper.toEntity(cart, book);
            cartItemRepository.save(newItem);

            cart.getItems().add(newItem);
            return cartMapper.toCartResponse(cart);
        }

        throw new DataDuplicateException("Book with ID: "
                + bookId
                + " already exists in the cart for user with ID: "
                + userId);
    }

    @Override
    @Transactional
    public CartResponse removeItemFromCart(Long cartItemId) {
        User user = authService.getCurrentUser();
        Long userId = user.getUserId();

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user with ID: " + userId));

        cart.getItems().remove(cart.getItems().stream()
                .filter(item -> item.getCartItemId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId)));

        cartItemRepository.deleteById(cartItemId);

        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public void clearCart() {
        User user = authService.getCurrentUser();
        Long userId = user.getUserId();

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user with ID: " + userId));

        cartItemRepository.deleteByCart_CartId(cart.getCartId());
    }
}
