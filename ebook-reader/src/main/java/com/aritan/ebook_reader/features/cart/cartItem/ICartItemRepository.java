package com.aritan.ebook_reader.features.cart.cartItem;

import com.aritan.ebook_reader.common.models.cart.CartItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICartItemRepository extends JpaRepository<CartItem, Long> {
    @EntityGraph(attributePaths = {
            "book",
            "book.authors"
    })
    Optional<CartItem> findByCart_CartIdAndBook_BookId(Long cartId, Long BookId);

    boolean existsByCart_CartIdAndBook_BookId(
            Long cartId,
            Long bookId
    );
    void deleteByCart_CartId(Long cartId);
}
