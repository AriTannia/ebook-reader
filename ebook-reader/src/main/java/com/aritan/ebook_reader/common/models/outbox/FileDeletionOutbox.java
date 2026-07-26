package com.aritan.ebook_reader.common.models.outbox;

import com.aritan.ebook_reader.common.constants.tables.outbox.FileDeletionOutboxTableConstants;
import com.aritan.ebook_reader.common.enums.outbox.FileSourceType;
import com.aritan.ebook_reader.common.enums.outbox.OutboxStatus;
import com.aritan.ebook_reader.config.outbox.dtos.OutboxItem;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = FileDeletionOutboxTableConstants.TABLE_NAME, schema = FileDeletionOutboxTableConstants.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public class FileDeletionOutbox implements OutboxItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = FileDeletionOutboxTableConstants.FILE_DELETION_OUTBOX_ID, nullable = false)
    private Long fileDeletionOutboxId;

    @Column(name = FileDeletionOutboxTableConstants.FILE_URL, nullable = false)
    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = FileDeletionOutboxTableConstants.SOURCE_TYPE, nullable = false)
    private FileSourceType sourceType;

    @Column(name = FileDeletionOutboxTableConstants.SOURCE_ENTITY_ID)
    private Long sourceEntityId;

    @Enumerated(EnumType.STRING)
    @Column(name = FileDeletionOutboxTableConstants.STATUS, nullable = false)
    private OutboxStatus status = OutboxStatus.PENDING;

    @Column(name = FileDeletionOutboxTableConstants.RETRY_COUNT, nullable = false)
    private int retryCount = 0;

    @Column(name = FileDeletionOutboxTableConstants.MAX_RETRIES, nullable = false)
    private int maxRetries = 5;

    @Column(name = FileDeletionOutboxTableConstants.ERROR_MESSAGE, columnDefinition = "TEXT")
    private String errorMessage;

    @CreatedDate
    @Column(name = FileDeletionOutboxTableConstants.CREATED_AT, nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = FileDeletionOutboxTableConstants.UPDATED_AT)
    private LocalDateTime updatedAt;

    @Column(name = FileDeletionOutboxTableConstants.DELETED_AT)
    private LocalDateTime deletedAt;

    @CreatedDate
    @Column(name = FileDeletionOutboxTableConstants.NEXT_RETRY_AT)
    private LocalDateTime nextRetryAt = LocalDateTime.now();

    @Override
    public Long getId() {
        return this.fileDeletionOutboxId;
    }

    @Override
    public void setProcessedAt(LocalDateTime processedAt) {
        this.deletedAt = processedAt;
    }

    @Override
    public String describe() {
        return "file deletion for " + fileUrl;
    }
}
