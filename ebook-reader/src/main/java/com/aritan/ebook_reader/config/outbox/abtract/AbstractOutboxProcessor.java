package com.aritan.ebook_reader.config.outbox.abtract;

import com.aritan.ebook_reader.common.enums.outbox.OutboxStatus;
import com.aritan.ebook_reader.config.outbox.dtos.OutboxItem;
import org.slf4j.Logger;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public abstract class AbstractOutboxProcessor<T extends OutboxItem> {
    private static final int BATCH_SIZE = 50;
    protected abstract Logger getLogger();
    protected abstract List<T> findPendingReady(LocalDateTime now, int batchSize);
    protected abstract void saveAll(List<T> items);
    protected abstract void save(T item);
    protected abstract void execute(T item);

    @Transactional
    public List<T> fetchAndMarkProcessing(){
        List<T> batch = findPendingReady(LocalDateTime.now(), BATCH_SIZE);
        batch.forEach(item -> item.setStatus(OutboxStatus.PROCESSING));
        saveAll(batch);
        return batch;
    }

    @Transactional
    protected void processItem(T item){
        try {
            execute(item);
            item.setStatus(OutboxStatus.SUCCESS);
            item.setProcessedAt(LocalDateTime.now());
            item.setErrorMessage(null);
        } catch (Exception e){
            getLogger().error("Error processing outbox item {}: {}", item.describe(), e.getMessage(), e);
            item.setRetryCount(item.getRetryCount() + 1);
            item.setErrorMessage(e.getMessage());

            if(item.getRetryCount() >= item.getMaxRetries()){
                item.setStatus(OutboxStatus.FAILED);
            } else {
                item.setStatus(OutboxStatus.PENDING);
                item.setNextRetryAt(calculateBackoff(item.getRetryCount()));
            }
        }
    }

    public void processOutbox(){
        List<T> batch = fetchAndMarkProcessing();
        for(T item : batch){
            processItem(item);
        }
    }

    private LocalDateTime calculateBackoff(int retryCount){
        long delayMinutes = (long) Math.pow(2, retryCount);
        return LocalDateTime.now().plusMinutes(delayMinutes);
    }
}
