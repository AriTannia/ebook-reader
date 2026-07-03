package com.aritan.ebook_reader.common.models.order;

import com.aritan.ebook_reader.common.constants.tables.book.BookTableConstants;
import com.aritan.ebook_reader.common.constants.tables.order.OrderItemTableConstant;
import com.aritan.ebook_reader.common.constants.tables.order.OrderTableConstant;
import com.aritan.ebook_reader.common.models.book.Book;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;

@Entity
@Table(name = OrderItemTableConstant.TABLE_NAME, schema = OrderItemTableConstant.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = OrderItemTableConstant.ORDER_ITEM_ID, updatable = false, nullable = false)
    private Long orderItemId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = OrderTableConstant.ORDER_ID, nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = BookTableConstants.BOOK_ID, nullable = false)
    private Book book;

    @Column(name = OrderItemTableConstant.BOOK_TITLE_SNAPSHOT, nullable = false, length = 200)
    private String bookTitleSnapshot;

    @Column(name = OrderItemTableConstant.PRICE_SNAPSHOT, nullable = false, precision = 10, scale = 2)
    private BigDecimal priceSnapshot;

    @Column(name = OrderItemTableConstant.QUANTITY, nullable = false)
    private Integer quantity = 1;
}
