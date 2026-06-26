package com.aritan.ebook_reader.common.models;

import com.aritan.ebook_reader.common.constants.tables.AuthorTableConstants;
import com.aritan.ebook_reader.common.constants.tables.BookTableConstants;
import com.aritan.ebook_reader.common.constants.tables.CategoryTableConstants;
import com.aritan.ebook_reader.common.constants.tables.TagTableConstants;
import com.aritan.ebook_reader.common.enums.BookBadge;
import com.aritan.ebook_reader.common.enums.BookStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = BookTableConstants.TABLE_NAME, schema = BookTableConstants.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = BookTableConstants.BOOK_ID, updatable = false, nullable = false)
    private Long bookId;

    @Column(name = BookTableConstants.TITLE, nullable = false, length = 200)
    private String title;

    @Column(name = BookTableConstants.DESCRIPTION, length = 1000)
    private String description;

    @Column(name = BookTableConstants.PRICE, nullable = false, scale = 2)
    private BigDecimal price;

    @Column(name = BookTableConstants.COVER_IMAGE_URL, length = 500)
    private String coverImageUrl;

    @Column(name = BookTableConstants.LANGUAGE, length = 50)
    private String language;

    @Column(name = BookTableConstants.PUBLISHED_DATE)
    private LocalDate publishedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = BookTableConstants.STATUS, nullable = false, length = 20)
    private BookStatus status = BookStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = BookTableConstants.BADGE, nullable = false, length = 20)
    private BookBadge badge;

    @Column(name = BookTableConstants.AVERAGE_RATING, precision = 2, scale = 1)
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(name = BookTableConstants.REVIEW_COUNT, nullable = false)
    private Long reviewCount = 0L;

    @Column(name = BookTableConstants.SOLD_COPIES, nullable = false)
    private Long soldCopies = 0L;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = BookTableConstants.BOOK_AUTHORS_TABLE,
            joinColumns = @JoinColumn(name = BookTableConstants.BOOK_ID),
            inverseJoinColumns = @JoinColumn(name = AuthorTableConstants.AUTHOR_ID)
    )
    private Set<Author> authors = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = BookTableConstants.BOOK_CATEGORIES_TABLE,
            joinColumns = @JoinColumn(name = BookTableConstants.BOOK_ID),
            inverseJoinColumns = @JoinColumn(name = CategoryTableConstants.CATEGORY_ID)
    )
    private Set<Category> categories = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = BookTableConstants.BOOK_TAGS_TABLE,
            joinColumns = @JoinColumn(name = BookTableConstants.BOOK_ID),
            inverseJoinColumns = @JoinColumn(name = TagTableConstants.TAG_ID)
    )
    private Set<Tag> tags = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = BookTableConstants.PUBLISHER_ID)
    private Publisher publisher;

    @CreatedDate
    @Column(name = BookTableConstants.CREATED_AT, updatable = false, nullable = false)
    private LocalDateTime createdAt;
}
