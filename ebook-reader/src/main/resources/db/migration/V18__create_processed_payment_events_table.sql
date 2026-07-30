CREATE TABLE processed_payment_events (
  processed_payment_event_id BIGSERIAL PRIMARY KEY,
  provider VARCHAR(20) NOT NULL,
  provider_txn_ref VARCHAR(200) NOT NULL,
  provider_transaction_id VARCHAR(200) NOT NULL,
  processed_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT uq_processed_payment_events_provider_txn_ref_transaction_id
      UNIQUE (provider, provider_txn_ref, provider_transaction_id)
);