package com.aritan.ebook_reader.features.file;

import com.aritan.ebook_reader.common.enums.outbox.OutboxStatus;
import com.aritan.ebook_reader.common.models.outbox.FileDeletionOutbox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IFileDeletionOutboxRepository extends JpaRepository<FileDeletionOutbox, Long> {
    @Query(value = """
        SELECT * FROM file_deletion_outbox
        WHERE status = 'PENDING'
        AND next_retry_at <= :now
        ORDER BY created_at ASC
        LIMIT :batchSize
        FOR UPDATE SKIP LOCKED
        """, nativeQuery = true)
    List<FileDeletionOutbox> findPendingReady(
            @Param("now") LocalDateTime now,
            @Param("batchSize") int batchSize);
    void deleteByStatusAndDeletedAtBefore(OutboxStatus status, LocalDateTime before);
}
