-- =========================================
-- Table: user_libraries
-- =========================================
CREATE TABLE public.user_libraries (
   user_library_id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   user_id             BIGINT NOT NULL,
   book_id             BIGINT NOT NULL,
   order_item_id       BIGINT,
   access_status       VARCHAR(20) NOT NULL,
   is_favorite         BOOLEAN NOT NULL DEFAULT FALSE,
   acquired_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

   CONSTRAINT fk_user_libraries_user
       FOREIGN KEY (user_id) REFERENCES public.users (user_id),
   CONSTRAINT fk_user_libraries_book
       FOREIGN KEY (book_id) REFERENCES public.books (book_id),
   CONSTRAINT fk_user_libraries_order_item
       FOREIGN KEY (order_item_id) REFERENCES public.order_items (order_item_id),

   CONSTRAINT uq_user_libraries_user_book
       UNIQUE (user_id, book_id),

   CONSTRAINT chk_user_libraries_access_status
       CHECK (access_status IN ('ACTIVE', 'REVOKED', 'REFUNDED'))
);

CREATE INDEX idx_user_libraries_user_id ON public.user_libraries (user_id);
CREATE INDEX idx_user_libraries_book_id ON public.user_libraries (book_id);
CREATE INDEX idx_user_libraries_access_status ON public.user_libraries (access_status);


-- =========================================
-- Table: reading_progresses
-- =========================================
CREATE TABLE public.reading_progresses (
    reading_progress_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id             BIGINT NOT NULL,
    book_id             BIGINT NOT NULL,
    locator             VARCHAR(500),
    progress_percent    NUMERIC(5, 2) NOT NULL DEFAULT 0,
    status              VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
    last_read_at        TIMESTAMP,
    finished_at         TIMESTAMP,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reading_progresses_user FOREIGN KEY (user_id) REFERENCES public.users (user_id),
    CONSTRAINT fk_reading_progresses_book FOREIGN KEY (book_id) REFERENCES public.books (book_id),
    CONSTRAINT uq_reading_progresses_user_book UNIQUE (user_id, book_id),
    CONSTRAINT chk_reading_progresses_status CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'FINISHED')),
    CONSTRAINT chk_reading_progresses_progress_percent CHECK (progress_percent >= 0 AND progress_percent <= 100)
);

CREATE INDEX idx_reading_progresses_user_id ON public.reading_progresses (user_id);
CREATE INDEX idx_reading_progresses_book_id ON public.reading_progresses (book_id);
CREATE INDEX idx_reading_progresses_last_read_at ON public.reading_progresses (last_read_at DESC);