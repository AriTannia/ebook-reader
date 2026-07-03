package com.aritan.ebook_reader.common.models.book;

import com.aritan.ebook_reader.common.constants.tables.book.BookTableConstants;
import com.aritan.ebook_reader.common.constants.tables.book.UserLibraryTableConstants;
import com.aritan.ebook_reader.common.constants.tables.order.OrderItemTableConstant;
import com.aritan.ebook_reader.common.constants.tables.user.UserTableConstants;
import com.aritan.ebook_reader.common.enums.book.LibraryAccessStatus;
import com.aritan.ebook_reader.common.models.order.OrderItem;
import com.aritan.ebook_reader.common.models.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = UserLibraryTableConstants.TABLE_NAME, schema = UserLibraryTableConstants.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLibrary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = UserLibraryTableConstants.USER_LIBRARY_ID, updatable = false, nullable = false)
    private Long userLibraryId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = UserTableConstants.USER_ID, nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = BookTableConstants.BOOK_ID, nullable = false)
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = OrderItemTableConstant.ORDER_ITEM_ID)
    private OrderItem sourceOrderItem;

    @Enumerated(EnumType.STRING)
    @Column(name = UserLibraryTableConstants.ACCESS_STATUS, nullable = false, length = 20)
    private LibraryAccessStatus accessStatus;

    @Column(name = UserLibraryTableConstants.IS_FAVORITE, nullable = false)
    private Boolean isFavorite = false;

    @CreatedDate
    @Column(name = UserLibraryTableConstants.ACQUIRED_AT, updatable = false, nullable = false)
    private LocalDateTime acquiredAt;
}
