package com.aritan.ebook_reader.common.models.outbox;

import com.aritan.ebook_reader.common.constants.tables.outbox.EmailOutboxTableConstants;
import com.aritan.ebook_reader.common.enums.email.EmailTemplateType;
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
@Table(name = EmailOutboxTableConstants.TABLE_NAME, schema = EmailOutboxTableConstants.SCHEMA)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public class EmailOutbox implements OutboxItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = EmailOutboxTableConstants.EMAIL_OUTBOX_ID, nullable = false)
    private Long emailOutboxId;

    @Column(name = EmailOutboxTableConstants.TO_EMAIL, nullable = false)
    private String toEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = EmailOutboxTableConstants.TEMPLATE_TYPE, nullable = false)
    private EmailTemplateType templateType;

    @Column(name = EmailOutboxTableConstants.PAYLOAD, nullable = false, columnDefinition = "TEXT")
    private String payload;

    @Enumerated(EnumType.STRING)
    @Column(name = EmailOutboxTableConstants.STATUS, nullable = false)
    private OutboxStatus status = OutboxStatus.PENDING;

    @Column(name = EmailOutboxTableConstants.RETRY_COUNT, nullable = false)
    private int retryCount = 0;

    @Column(name = EmailOutboxTableConstants.MAX_RETRIES, nullable = false)
    private int maxRetries = 5;

    @Column(name = EmailOutboxTableConstants.ERROR_MESSAGE, columnDefinition = "TEXT")
    private String errorMessage;

    @CreatedDate
    @Column(name = EmailOutboxTableConstants.CREATED_AT, nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = EmailOutboxTableConstants.UPDATED_AT)
    private LocalDateTime updatedAt;

    @Column(name = EmailOutboxTableConstants.SENT_AT)
    private LocalDateTime sentAt;

    @CreatedDate
    @Column(name = EmailOutboxTableConstants.NEXT_RETRY_AT)
    private LocalDateTime nextRetryAt = LocalDateTime.now();

    @Override
    public Long getId() {
        return this.emailOutboxId;
    }

    @Override
    public void setProcessedAt(LocalDateTime processedAt) {
        this.sentAt = processedAt;
    }

    @Override
    public String describe() {
        return "email to " + toEmail;
    }
}
