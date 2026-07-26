package com.aritan.ebook_reader.config.scheduler;

import com.aritan.ebook_reader.common.enums.outbox.OutboxStatus;
import com.aritan.ebook_reader.config.smpt.repositories.IEmailOutboxRepository;
import com.aritan.ebook_reader.features.file.IFileDeletionOutboxRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class OutboxCleanupJob {
    private final IEmailOutboxRepository emailOutboxRepository;
    private final IFileDeletionOutboxRepository fileDeletionOutboxRepository;

    @Scheduled(fixedRate = 10_000)
    @Transactional
    public void cleanup(){
        emailOutboxRepository.deleteByStatusAndSentAtBefore(
                OutboxStatus.SUCCESS,
                LocalDateTime.now().minusDays(7)
        );
        fileDeletionOutboxRepository.deleteByStatusAndDeletedAtBefore(
                OutboxStatus.SUCCESS,
                LocalDateTime.now().minusDays(7)
        );
    }
}
