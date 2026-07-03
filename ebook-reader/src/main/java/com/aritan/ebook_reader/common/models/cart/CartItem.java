package com.aritan.ebook_reader.common.models.cart;

import com.aritan.ebook_reader.common.constants.tables.book.BookTableConstants;
import com.aritan.ebook_reader.common.constants.tables.cart.CartItemTableConstant;
import com.aritan.ebook_reader.common.constants.tables.cart.CartTableConstant;
import com.aritan.ebook_reader.common.models.book.Book;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = CartItemTableConstant.TABLE_NAME, schema = CartItemTableConstant.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = CartItemTableConstant.CART_ITEM_ID, updatable = false, nullable = false)
    private Long cartItemId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = CartTableConstant.CART_ID, nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = BookTableConstants.BOOK_ID, nullable = false)
    private Book book;

    @Column(name = CartItemTableConstant.QUANTITY, nullable = false)
    private Integer quantity = 1;

    @LastModifiedDate
    @Column(name = CartItemTableConstant.ADDED_AT, nullable = false)
    private LocalDateTime addedAt;
}
