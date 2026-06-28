-- =========================================================
-- CARTS
-- =========================================================
CREATE TABLE public.carts (
    cart_id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL UNIQUE,

    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_cart_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_cart_user
    ON public.carts(user_id);


-- =========================================================
-- CART ITEMS
-- =========================================================
CREATE TABLE public.cart_items (
    cart_item_id BIGSERIAL PRIMARY KEY,

    cart_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,

    quantity INTEGER NOT NULL DEFAULT 1,

    added_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_cart_item_cart
        FOREIGN KEY (cart_id)
        REFERENCES public.carts(cart_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_item_book
        FOREIGN KEY (book_id)
        REFERENCES public.books(book_id)
        ON DELETE CASCADE,

    -- Một sách chỉ xuất hiện một lần trong cart
    CONSTRAINT uq_cart_book UNIQUE (cart_id, book_id)
);

CREATE INDEX idx_cart_item_cart
    ON public.cart_items(cart_id);

CREATE INDEX idx_cart_item_book
    ON public.cart_items(book_id);


-- =========================================================
-- ORDERS
-- =========================================================
CREATE TABLE public.orders (
    order_id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    status VARCHAR(30) NOT NULL,

    total_amount NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMP NOT NULL,
    paid_at TIMESTAMP,

    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_order_status
        CHECK (status IN (
            'PENDING',
            'PAID',
            'FAILED',
            'CANCELLED'
        ))
);

CREATE INDEX idx_order_user
    ON public.orders(user_id);

CREATE INDEX idx_order_status
    ON public.orders(status);


-- =========================================================
-- ORDER ITEMS
-- =========================================================
CREATE TABLE public.order_items (
    order_item_id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,

    book_title_snapshot VARCHAR(200) NOT NULL,

    price_snapshot NUMERIC(10,2) NOT NULL,

    quantity INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id)
        REFERENCES public.orders(order_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_item_book
        FOREIGN KEY (book_id)
        REFERENCES public.books(book_id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_order_item_order
    ON public.order_items(order_id);

CREATE INDEX idx_order_item_book
    ON public.order_items(book_id);


-- =========================================================
-- PAYMENTS
-- =========================================================
CREATE TABLE public.payments (
    payment_id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL,

    provider VARCHAR(30) NOT NULL,

    status VARCHAR(30) NOT NULL,

    amount NUMERIC(10,2) NOT NULL,

    provider_txn_ref VARCHAR(255),

    provider_transaction_id VARCHAR(255),

    response_code VARCHAR(100),

    response_message VARCHAR(500),

    raw_response_json TEXT,

    created_at TIMESTAMP NOT NULL,

    completed_at TIMESTAMP,

    CONSTRAINT fk_payment_order
        FOREIGN KEY (order_id)
        REFERENCES public.orders(order_id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_provider_txn_ref
        UNIQUE(provider_txn_ref),

    CONSTRAINT chk_payment_provider
        CHECK (provider IN (
            'VNPAY',
            'MOMO',
            'STRIPE'
        )),

    CONSTRAINT chk_payment_status
        CHECK (status IN (
            'PENDING',
            'SUCCESS',
            'FAILED'
        ))
);

CREATE INDEX idx_payment_order
    ON public.payments(order_id);

CREATE INDEX idx_payment_status
    ON public.payments(status);

CREATE INDEX idx_payment_provider
    ON public.payments(provider);