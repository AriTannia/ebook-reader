package com.aritan.ebook_reader.common.models.book;

import com.aritan.ebook_reader.common.constants.tables.PublisherTableConstants;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = PublisherTableConstants.TABLE_NAME, schema = PublisherTableConstants.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Publisher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = PublisherTableConstants.PUBLISHER_ID, updatable = false, nullable = false)
    private Long publisherId;

    @Column(name = PublisherTableConstants.PUBLISHER_NAME, nullable = false, length = 100)
    private String publisherName;

    @Column(name = PublisherTableConstants.LOGO_URL, length = 500)
    private String logoUrl;

    @CreatedDate
    @Column(name = PublisherTableConstants.CREATED_AT, updatable = false, nullable = false)
    private LocalDateTime createdAt;
}
