package com.aritan.ebook_reader.config.smpt.repositories;

import com.aritan.ebook_reader.common.enums.outbox.OutboxStatus;
import com.aritan.ebook_reader.common.models.outbox.EmailOutbox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IEmailOutboxRepository extends JpaRepository<EmailOutbox, Long> {
    @Query(value = """
        SELECT * FROM email_outbox
        WHERE status = 'PENDING'
        AND next_retry_at <= :now
        ORDER BY created_at ASC
        LIMIT :batchSize
        FOR UPDATE SKIP LOCKED
        """, nativeQuery = true)
    List<EmailOutbox> findPendingReady(
            @Param("now") LocalDateTime now,
            @Param("batchSize") int batchSize);

    void deleteByStatusAndSentAtBefore(OutboxStatus status, LocalDateTime before);
}
