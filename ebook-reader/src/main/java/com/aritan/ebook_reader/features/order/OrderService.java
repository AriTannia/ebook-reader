package com.aritan.ebook_reader.features.order;

import com.aritan.ebook_reader.common.constants.messages.cart.CartMessage;
import com.aritan.ebook_reader.common.constants.messages.order.OrderMessage;
import com.aritan.ebook_reader.common.enums.order.OrderStatus;
import com.aritan.ebook_reader.common.exception.InvalidRequestException;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.common.models.cart.Cart;
import com.aritan.ebook_reader.common.models.cart.CartItem;
import com.aritan.ebook_reader.common.models.order.Order;
import com.aritan.ebook_reader.common.models.order.OrderItem;
import com.aritan.ebook_reader.features.auth.IAuthService;
import com.aritan.ebook_reader.features.cart.ICartRepository;
import com.aritan.ebook_reader.features.cart.cartItem.ICartItemRepository;
import com.aritan.ebook_reader.features.order.dtos.OrderAdminResponse;
import com.aritan.ebook_reader.features.order.dtos.OrderResponse;
import com.aritan.ebook_reader.features.order.utilities.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final IOrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final ICartRepository cartRepository;
    private final ICartItemRepository cartItemRepository;

    @Override
    @Transactional
    public OrderResponse checkout(User user) {
        Long userId = user.getUserId();

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(CartMessage.CART_NOT_FOUND_USER_ID, userId)
                ));

        if(cart.getItems().isEmpty()){
            throw new InvalidRequestException(CartMessage.CART_IS_EMPTY);
        }

        Order order = orderMapper.toEntity(cart);

        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.getItems().forEach(item -> item.setOrder(order));

        orderRepository.save(order);
        cartItemRepository.deleteByCart_CartId(cart.getCartId());

        return orderMapper.toResponse(order);
    }

    @Override
    public Page<OrderResponse> getMyOrders(Long userId, Pageable pageable) {
        Page<Order> orders = orderRepository.findAllByUser_UserId(userId, pageable);
        return orders.map(orderMapper::toResponse);
    }

    @Override
    public OrderResponse getMyOrderById(Long userId, Long orderId) {
        Order order = orderRepository.findByOrderIdAndUser_UserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                                String.format(OrderMessage.ORDER_NOT_FOUND, orderId)));

        return orderMapper.toResponse(order);
    }

    @Override
    public OrderResponse cancelMyOrder(User user, Long orderId) {
        Long userId = user.getUserId();

        Order order = orderRepository.findByOrderIdAndUser_UserId(orderId, userId)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                        String.format(
                                                OrderMessage.ORDER_NOT_FOUND_AND_USER_ID, orderId, userId)));

        if(order.getStatus() != OrderStatus.PENDING){
            throw new InvalidRequestException(OrderMessage.ORDER_CANNOT_CANCELLED);
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        restoreItemsToCart(user, order);

        return orderMapper.toResponse(order);
    }

    @Override
    public Page<OrderAdminResponse> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);

        return orders.map(orderMapper::toAdminResponse);
    }

    @Override
    public OrderResponse getOrderByIdForAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                String.format(OrderMessage.ORDER_NOT_FOUND, orderId)
                        ));
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrderByAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                String.format(OrderMessage.ORDER_NOT_FOUND, orderId)
                        ));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new InvalidRequestException(OrderMessage.ORDER_CANNOT_CANCELLED_DETAILS);
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        return orderMapper.toResponse(order);
    }

    @Override
    public OrderResponse refundOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                String.format(OrderMessage.ORDER_NOT_FOUND, orderId)
                        ));
        order.setStatus(OrderStatus.REFUNDED);
        orderRepository.save(order);

        return orderMapper.toResponse(order);
    }

    private void restoreItemsToCart(User user, Order order){
        Cart cart = cartRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                String.format(CartMessage.CART_NOT_FOUND_USER_ID, user.getUserId())
                        ));

        for(OrderItem orderItem : order.getItems()){
            Long bookId = orderItem.getBook().getBookId();

            boolean alreadyInCart = cartItemRepository.existsByCart_CartIdAndBook_BookId(cart.getCartId(), bookId);

            if(!alreadyInCart){
                CartItem cartItem = new CartItem();
                cartItem.setCart(cart);
                cartItem.setBook(orderItem.getBook());
                cartItem.setQuantity(orderItem.getQuantity());
                cartItem.setAddedAt(LocalDateTime.now());

                cartItemRepository.save(cartItem);
            }
        }
    }
}
