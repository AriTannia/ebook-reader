package com.aritan.ebook_reader.common.models.book;

import com.aritan.ebook_reader.common.constants.tables.book.BookTableConstants;
import com.aritan.ebook_reader.common.constants.tables.book.ReadingProgressTableConstants;
import com.aritan.ebook_reader.common.constants.tables.user.UserTableConstants;
import com.aritan.ebook_reader.common.enums.book.ReadingStatus;
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

@Entity
@Table(name = ReadingProgressTableConstants.TABLE_NAME, schema = ReadingProgressTableConstants.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReadingProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = ReadingProgressTableConstants.READING_PROGRESS_ID, updatable = false, nullable = false)
    private Long readingProgressId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = UserTableConstants.USER_ID, nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = BookTableConstants.BOOK_ID, nullable = false)
    private Book book;

    @Column(name = ReadingProgressTableConstants.LOCATOR, length = 500)
    private String locator;

    @Column(name = ReadingProgressTableConstants.PROGRESS_PERCENT, precision = 5, scale = 2)
    private BigDecimal progressPercent = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = ReadingProgressTableConstants.STATUS, nullable = false, length = 20)
    private ReadingStatus status = ReadingStatus.NOT_STARTED;

    @Column(name = ReadingProgressTableConstants.LAST_READ_AT)
    private LocalDateTime lastReadAt;

    @Column(name = ReadingProgressTableConstants.FINISHED_AT)
    private LocalDateTime finishedAt;

    @CreatedDate
    @Column(name = ReadingProgressTableConstants.CREATED_AT, updatable = false, nullable = false)
    private LocalDateTime createdAt;
}
