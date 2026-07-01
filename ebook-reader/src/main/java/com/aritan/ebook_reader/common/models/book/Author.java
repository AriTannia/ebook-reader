package com.aritan.ebook_reader.common.models.book;

import com.aritan.ebook_reader.common.constants.tables.AuthorTableConstants;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = AuthorTableConstants.TABLE_NAME, schema = AuthorTableConstants.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = AuthorTableConstants.AUTHOR_ID, updatable = false, nullable = false)
    private Long authorId;

    @Column(name = AuthorTableConstants.AUTHOR_NAME, nullable = false, length = 100)
    private String authorName;

    @Column(name = AuthorTableConstants.AVATAR_URL, length = 500)
    private String avatarUrl;

    @Column(name = AuthorTableConstants.BIOGRAPHY, columnDefinition = "TEXT")
    private String biography;

    @CreatedDate
    @Column(name = AuthorTableConstants.CREATED_AT, updatable = false, nullable = false)
    private LocalDateTime createdAt;
}
