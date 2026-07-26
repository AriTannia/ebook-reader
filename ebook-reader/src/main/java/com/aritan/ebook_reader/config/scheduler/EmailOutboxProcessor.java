package com.aritan.ebook_reader.config.scheduler;

import com.aritan.ebook_reader.common.enums.email.EmailTemplateType;
import com.aritan.ebook_reader.common.enums.outbox.OutboxStatus;
import com.aritan.ebook_reader.common.models.outbox.EmailOutbox;
import com.aritan.ebook_reader.config.outbox.abtract.AbstractOutboxProcessor;
import com.aritan.ebook_reader.config.smpt.EmailService;
import com.aritan.ebook_reader.config.smpt.dtos.PasswordResetPayload;
import com.aritan.ebook_reader.config.smpt.interfaces.IEmailService;
import com.aritan.ebook_reader.config.smpt.repositories.IEmailOutboxRepository;
import com.aritan.ebook_reader.config.smpt.utilities.OutboxPayloadMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class EmailOutboxProcessor extends AbstractOutboxProcessor<EmailOutbox> {
    private final IEmailOutboxRepository emailOutboxRepository;
    private final IEmailService emailService;
    private final OutboxPayloadMapper payloadMapper;
    private static final Logger logger = LoggerFactory.getLogger(EmailOutboxProcessor.class);

    @Override
    protected Logger getLogger() {
        return logger;
    }

    @Override
    protected List<EmailOutbox> findPendingReady(LocalDateTime now, int batchSize) {
        return emailOutboxRepository.findPendingReady(now, batchSize);
    }

    @Override
    protected void saveAll(List<EmailOutbox> items) {
        emailOutboxRepository.saveAll(items);
    }

    @Override
    protected void save(EmailOutbox item) {
        emailOutboxRepository.save(item);
    }

    @Override
    protected void execute(EmailOutbox item) {
        if(item.getTemplateType() == EmailTemplateType.PASSWORD_RESET) {
            PasswordResetPayload payload = payloadMapper.deserialize(item.getPayload(), PasswordResetPayload.class);
            emailService.sendPasswordResetEmail(item.getToEmail(), payload.getResetToken());
        } else {
            throw new IllegalArgumentException("Unsupported email template type: " + item.getTemplateType());
        }
    }

    @Scheduled(fixedDelay = 10_000)
    public void run(){
        processOutbox();
    }
}
