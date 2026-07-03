package com.aritan.ebook_reader.common.models.book;

import com.aritan.ebook_reader.common.constants.tables.book.CategoryTableConstants;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = CategoryTableConstants.TABLE_NAME, schema = CategoryTableConstants.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = CategoryTableConstants.CATEGORY_ID, updatable = false, nullable = false)
    private Long categoryId;

    @Column(name = CategoryTableConstants.CATEGORY_NAME, nullable = false, length = 100, unique = true)
    private String categoryName;

    @Column(name = CategoryTableConstants.DESCRIPTION, columnDefinition = "TEXT")
    private String description;

    @Column(name = CategoryTableConstants.SLUG, nullable = false, length = 100, unique = true)
    private String slug;

    @CreatedDate
    @Column(name = CategoryTableConstants.CREATED_AT, updatable = false, nullable = false)
    private LocalDateTime createdAt;
}
