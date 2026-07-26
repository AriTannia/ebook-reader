CREATE TABLE public.file_deletion_outbox (
 file_deletion_outbox_id BIGSERIAL PRIMARY KEY,
 file_url TEXT NOT NULL,
 source_type VARCHAR(50) NOT NULL,
 source_entity_id BIGINT,
 status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
 retry_count INT NOT NULL DEFAULT 0,
 max_retries INT NOT NULL DEFAULT 5,
 error_message TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ,
 deleted_at TIMESTAMPTZ,
 next_retry_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 CONSTRAINT chk_file_deletion_outbox_status
     CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED')),
 CONSTRAINT chk_file_deletion_outbox_source_type
     CHECK (source_type IN ('BOOK_COVER', 'AUTHOR_AVATAR', 'PUBLISHER_LOGO', 'USER_AVATAR')),
 CONSTRAINT chk_file_deletion_outbox_retry_count
     CHECK (retry_count >= 0),
 CONSTRAINT chk_file_deletion_outbox_max_retries
     CHECK (max_retries >= 0)
);

CREATE INDEX idx_file_deletion_outbox_status_retry ON public.file_deletion_outbox (status, next_retry_at);
CREATE INDEX idx_file_deletion_outbox_created_at ON public.file_deletion_outbox (created_at);