package com.aritan.ebook_reader.features.cart;

import com.aritan.ebook_reader.common.models.cart.Cart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICartRepository extends JpaRepository<Cart, Long> {
    @EntityGraph(attributePaths = {
            "items",
            "items.book",
            "items.book.authors"
    })
    Optional<Cart> findByUser_UserId(Long userId);
}
