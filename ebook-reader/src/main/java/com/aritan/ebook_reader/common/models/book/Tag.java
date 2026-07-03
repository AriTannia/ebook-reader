package com.aritan.ebook_reader.common.models.book;

import com.aritan.ebook_reader.common.constants.tables.book.TagTableConstants;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = TagTableConstants.TABLE_NAME, schema = TagTableConstants.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = TagTableConstants.TAG_ID, updatable = false, nullable = false)
    private UUID tagId;

    @Column(name = TagTableConstants.NAME, nullable = false, length = 100)
    private String tagName;
    @CreatedDate
    @Column(name = TagTableConstants.CREATED_AT, updatable = false, nullable = false)
    private LocalDateTime createdAt;
}
