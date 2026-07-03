package com.aritan.ebook_reader.common.models.cart;

import com.aritan.ebook_reader.common.constants.tables.user.UserTableConstants;
import com.aritan.ebook_reader.common.constants.tables.cart.CartTableConstant;
import com.aritan.ebook_reader.common.models.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = CartTableConstant.TABLE_NAME, schema = CartTableConstant.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = CartTableConstant.CART_ID, updatable = false, nullable = false)
    private Long cartId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = UserTableConstants.USER_ID, nullable = false, unique = true)
    private User user;

    @OneToMany(mappedBy = CartTableConstant.CART, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    @CreatedDate
    @Column(name = CartTableConstant.CREATED_AT, updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = CartTableConstant.UPDATED_AT, nullable = false)
    private LocalDateTime updatedAt;
}
