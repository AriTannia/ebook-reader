CREATE TABLE public.tags (
    tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE
        DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Book - Tag many-to-many relationship
CREATE TABLE public.book_tags (
    book_id BIGINT NOT NULL,
    tag_id UUID NOT NULL,

    PRIMARY KEY (book_id, tag_id),

    CONSTRAINT fk_book_tags_book
        FOREIGN KEY (book_id)
        REFERENCES public.books(book_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_book_tags_tag
        FOREIGN KEY (tag_id)
        REFERENCES public.tags(tag_id)
        ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE public.reviews (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,

    rating INTEGER NOT NULL
        CHECK (rating BETWEEN 1 AND 5),

    comment VARCHAR(1000),

    helpful_count INTEGER NOT NULL DEFAULT 0,

    verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,

    edited BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE
        DEFAULT CURRENT_TIMESTAMP NOT NULL,

    updated_at TIMESTAMP WITH TIME ZONE
        DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reviews_book
        FOREIGN KEY (book_id)
        REFERENCES public.books(book_id)
        ON DELETE CASCADE,

    CONSTRAINT uk_reviews_user_book
        UNIQUE (user_id, book_id)
);