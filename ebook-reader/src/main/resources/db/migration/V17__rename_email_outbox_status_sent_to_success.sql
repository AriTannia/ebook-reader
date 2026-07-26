ALTER TABLE public.email_outbox
DROP CONSTRAINT chk_email_outbox_status;

UPDATE public.email_outbox
SET status = 'SUCCESS'
WHERE status = 'SENT';

ALTER TABLE public.email_outbox
    ADD CONSTRAINT chk_email_outbox_status
        CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED'));