package com.aritan.ebook_reader.config.scheduler;

import com.aritan.ebook_reader.common.models.outbox.FileDeletionOutbox;
import com.aritan.ebook_reader.config.outbox.abtract.AbstractOutboxProcessor;
import com.aritan.ebook_reader.features.file.IFileDeletionOutboxRepository;
import com.aritan.ebook_reader.features.file.IFileService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FileDeletionOutboxProcessor extends AbstractOutboxProcessor<FileDeletionOutbox> {
    private final IFileDeletionOutboxRepository fileDeletionOutboxRepository;
    private final IFileService fileService;
    private static final Logger logger = LoggerFactory.getLogger(FileDeletionOutboxProcessor.class);
    @Override
    protected Logger getLogger() {
        return logger;
    }

    @Override
    protected List<FileDeletionOutbox> findPendingReady(LocalDateTime now, int batchSize) {
        return fileDeletionOutboxRepository.findPendingReady(now, batchSize);
    }

    @Override
    protected void saveAll(List<FileDeletionOutbox> items) {
        fileDeletionOutboxRepository.saveAll(items);
    }

    @Override
    protected void save(FileDeletionOutbox item) {
        fileDeletionOutboxRepository.save(item);
    }

    @Override
    protected void execute(FileDeletionOutbox item) {
        fileService.deleteFile(item.getFileUrl());
    }

    @Scheduled(fixedDelay = 300_000)
    public void run() { processOutbox(); }
}
