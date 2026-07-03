package com.aritan.ebook_reader.common.models.order;

import com.aritan.ebook_reader.common.constants.tables.user.UserTableConstants;
import com.aritan.ebook_reader.common.constants.tables.order.OrderTableConstant;
import com.aritan.ebook_reader.common.enums.order.OrderStatus;
import com.aritan.ebook_reader.common.models.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = OrderTableConstant.TABLE_NAME, schema = OrderTableConstant.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = OrderTableConstant.ORDER_ID, updatable = false, nullable = false)
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = UserTableConstants.USER_ID, nullable = false)
    private User user;

    @OneToMany(mappedBy = OrderTableConstant.ORDER, cascade = CascadeType.ALL)
    private List<OrderItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = OrderTableConstant.STATUS, nullable = false)
    private OrderStatus status; // PENDING, PAID, FAILED, CANCELLED

    @Column(name = OrderTableConstant.TOTAL_AMOUNT, nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @CreatedDate
    @Column(name = OrderTableConstant.CREATED_AT, updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Column(name = OrderTableConstant.PAID_AT)
    private LocalDateTime paidAt;
}
