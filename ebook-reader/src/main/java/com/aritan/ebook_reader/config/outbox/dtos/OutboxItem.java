package com.aritan.ebook_reader.config.outbox.dtos;

import com.aritan.ebook_reader.common.enums.outbox.OutboxStatus;

import java.time.LocalDateTime;

public interface OutboxItem {
    Long getId();
    OutboxStatus getStatus();
    void setStatus(OutboxStatus status);
    int getRetryCount();
    void setRetryCount(int retryCount);
    int getMaxRetries();
    String getErrorMessage();
    void setErrorMessage(String errorMessage);
    void setUpdatedAt(LocalDateTime updatedAt);
    void setNextRetryAt(LocalDateTime nextRetryAt);
    void setProcessedAt(LocalDateTime processedAt);
    String describe();
}
