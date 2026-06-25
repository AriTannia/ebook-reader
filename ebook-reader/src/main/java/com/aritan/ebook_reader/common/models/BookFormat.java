package com.aritan.ebook_reader.common.models;

import com.aritan.ebook_reader.common.constants.tables.BookFormatTableConstants;
import com.aritan.ebook_reader.common.enums.FormatType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = BookFormatTableConstants.TABLE_NAME, schema = BookFormatTableConstants.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookFormat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = BookFormatTableConstants.BOOK_FORMAT_ID, updatable = false, nullable = false)
    private Long bookFormatId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = BookFormatTableConstants.BOOK_ID, nullable = false)
    private Book book;

    @Enumerated(EnumType.STRING)
    @Column(name = BookFormatTableConstants.FORMAT_TYPE, nullable = false)
    private FormatType formatType;

    @Column(name = BookFormatTableConstants.STORAGE_URL, nullable = false, length = 500)
    private String storageUrl;

    @Column(name = BookFormatTableConstants.MIME_TYPE, nullable = false)
    private String mimeType;

    @Column(name = BookFormatTableConstants.FILE_SIZE, nullable = false)
    private Long fileSize;

    @Column(name = BookFormatTableConstants.IS_PRIMARY, nullable = false)
    private Boolean isPrimary = false;

    @CreatedDate
    @Column(name = BookFormatTableConstants.CREATED_AT, updatable = false, nullable = false)
    private LocalDateTime createdAt;
}
