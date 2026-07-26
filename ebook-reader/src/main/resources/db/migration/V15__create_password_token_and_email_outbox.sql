CREATE TABLE public.password_reset_tokens (
  password_reset_token_id BIGSERIAL PRIMARY KEY,
  token TEXT NOT NULL,
  user_id BIGINT NOT NULL,
  expiry_date TIMESTAMPTZ NOT NULL,

  CONSTRAINT uq_password_reset_tokens_token UNIQUE (token),
  CONSTRAINT uq_password_reset_tokens_user_id UNIQUE (user_id),
  CONSTRAINT fk_password_reset_tokens_user
      FOREIGN KEY (user_id)
          REFERENCES public.users (user_id)
          ON DELETE CASCADE
);

CREATE INDEX idx_password_reset_tokens_user_id ON public.password_reset_tokens (user_id);
CREATE INDEX idx_password_reset_tokens_expiry_date ON public.password_reset_tokens (expiry_date);

CREATE TABLE public.email_outbox (
 email_outbox_id BIGSERIAL PRIMARY KEY,
 to_email VARCHAR(255) NOT NULL,
 template_type VARCHAR(50) NOT NULL,
 payload TEXT NOT NULL,
 status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
 retry_count INT NOT NULL DEFAULT 0,
 max_retries INT NOT NULL DEFAULT 5,
 error_message TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ,
 sent_at TIMESTAMPTZ,
 next_retry_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

 CONSTRAINT chk_email_outbox_status
     CHECK (status IN ('PENDING', 'PROCESSING', 'SENT', 'FAILED')),
 CONSTRAINT chk_email_outbox_template_type
     CHECK (template_type IN ('PASSWORD_RESET')),
 CONSTRAINT chk_email_outbox_retry_count
     CHECK (retry_count >= 0),
 CONSTRAINT chk_email_outbox_max_retries
     CHECK (max_retries >= 0),
 CONSTRAINT chk_email_outbox_to_email_format
     CHECK (to_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_email_outbox_status_retry ON public.email_outbox (status, next_retry_at);
CREATE INDEX idx_email_outbox_created_at ON public.email_outbox (created_at);
