package com.aritan.ebook_reader.features.cart;

import com.aritan.ebook_reader.common.constants.messages.book.BookMessage;
import com.aritan.ebook_reader.common.constants.messages.cart.CartMessage;
import com.aritan.ebook_reader.common.constants.messages.library.UserLibraryMessage;
import com.aritan.ebook_reader.common.exception.DataDuplicateException;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.Book;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.common.models.cart.Cart;
import com.aritan.ebook_reader.common.models.cart.CartItem;
import com.aritan.ebook_reader.features.auth.IAuthService;
import com.aritan.ebook_reader.features.book.IBookRepository;
import com.aritan.ebook_reader.features.cart.cartItem.ICartItemRepository;
import com.aritan.ebook_reader.features.cart.dtos.CartAddItemRequest;
import com.aritan.ebook_reader.features.cart.dtos.CartResponse;
import com.aritan.ebook_reader.features.cart.utilities.CartMapper;
import com.aritan.ebook_reader.features.library.IUserLibraryRepository;
import com.aritan.ebook_reader.features.library.IUserLibraryService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService{
    private final ICartRepository cartRepository;
    private final ICartItemRepository cartItemRepository;
    private final IBookRepository bookRepository;
    private final IUserLibraryRepository libraryRepository;
    private final CartMapper cartMapper;
    private static final Logger logger = org.slf4j.LoggerFactory.getLogger(CartService.class);
    @Override
    @Transactional
    public CartResponse getCartByUserId(User user) {
        Long userId = user.getUserId();

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElse(null);

        if(cart == null){
            cart = createCartForUser(user);
        }

        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addItemToCart(Long userId, CartAddItemRequest addItemRequest) {
        Long bookId = addItemRequest.getBookId();

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(CartMessage.CART_NOT_FOUND_USER_ID, userId)));

        boolean existedItem = cartItemRepository.existsByCart_CartIdAndBook_BookId(cart.getCartId(), bookId);
        boolean existedInLibrary = libraryRepository.existsByUser_UserIdAndBook_BookId(userId, bookId);

        if(existedItem) {
            throw new DataDuplicateException(
                    String.format(CartMessage.CART_ITEM_ALREADY_EXISTS, bookId, userId));
        }

        if(existedInLibrary){
            throw new DataDuplicateException(
                    String.format(UserLibraryMessage.BOOK_ALREADY_IN_LIBRARY, bookId, userId));
        }

        Book book = bookRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)));

        CartItem newItem = cartMapper.toEntity(cart, book);

        try {
            cartItemRepository.saveAndFlush(newItem);
        } catch (DataIntegrityViolationException e) {
            throw new DataDuplicateException(
                    String.format(CartMessage.CART_ITEM_ALREADY_EXISTS, bookId, userId));
        }

        cart.getItems().add(newItem);
        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItemFromCart(Long userId, Long cartItemId) {
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(CartMessage.CART_NOT_FOUND_USER_ID, userId)));

        cart.getItems().remove(cart.getItems().stream()
                .filter(item -> item.getCartItemId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(CartMessage.CART_ITEM_NOT_FOUND, cartItemId))));

        cartItemRepository.deleteById(cartItemId);

        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(CartMessage.CART_NOT_FOUND_USER_ID, userId)
                ));

        cartItemRepository.deleteByCart_CartId(cart.getCartId());
    }

    private Cart createCartForUser(User user) {
        try {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.saveAndFlush(newCart);
        } catch (DataIntegrityViolationException e) {
            return cartRepository.findByUser_UserId(user.getUserId())
                    .orElseThrow(() -> {
                        logger.error(
                                "Cart creation conflict unresolved for userId={}", user.getUserId(), e);
                       return new ResourceNotFoundException(
                            String.format(CartMessage.CART_CREATION_CONFLICT_UNRESOLVED, user.getUserId())
                       );
                    });
        }
    }
}
