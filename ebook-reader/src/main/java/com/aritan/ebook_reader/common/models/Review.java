package com.aritan.ebook_reader.common.models;

import com.aritan.ebook_reader.common.constants.tables.BookTableConstants;
import com.aritan.ebook_reader.common.constants.tables.ReviewTableConstants;
import com.aritan.ebook_reader.common.constants.tables.UserTableConstants;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = ReviewTableConstants.TABLE_NAME,
        schema = ReviewTableConstants.SCHEMA,
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {
                        UserTableConstants.USER_ID,
                        BookTableConstants.BOOK_ID
                })
        })
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = ReviewTableConstants.REVIEW_ID, updatable = false, nullable = false)
    private UUID reviewId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = UserTableConstants.USER_ID, nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = BookTableConstants.BOOK_ID, nullable = false)
    private Book book;

    @Column(name = ReviewTableConstants.RATING, nullable = false)
    private Integer rating;

    @Column(name = ReviewTableConstants.COMMENT, length = 1000)
    private String comment;

    @Column(name = ReviewTableConstants.HELPFUL_COUNT, nullable = false)
    private Integer helpfulCount = 0;

    @Column(name = ReviewTableConstants.VERIFIED_PURCHASE, nullable = false)
    private Boolean verifiedPurchase = false;

    @Column(name = ReviewTableConstants.EDITED, nullable = false)
    private Boolean edited = false;

    @CreatedDate
    @Column(name = ReviewTableConstants.CREATED_AT, updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = ReviewTableConstants.UPDATED_AT, nullable = false)
    private LocalDateTime updatedAt;
}
