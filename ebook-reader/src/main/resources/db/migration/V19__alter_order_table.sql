ALTER TABLE public.orders
    ADD COLUMN payment_expires_at TIMESTAMP;

UPDATE public.orders
SET payment_expires_at = created_at + INTERVAL '15 minutes'
WHERE status = 'PENDING' AND payment_expires_at IS NULL;

ALTER TABLE public.orders
DROP CONSTRAINT chk_order_status;

ALTER TABLE public.orders
    ADD CONSTRAINT chk_order_status
        CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED'));

CREATE INDEX idx_order_payment_expires_at ON public.orders(payment_expires_at);