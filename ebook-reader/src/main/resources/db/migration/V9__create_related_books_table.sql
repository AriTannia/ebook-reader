CREATE TABLE public.authors (
    author_id BIGSERIAL PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    biography TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.categories (
   category_id BIGSERIAL PRIMARY KEY,
   category_name VARCHAR(100) NOT NULL UNIQUE,
   description TEXT,
   slug VARCHAR(100) NOT NULL UNIQUE,
   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.publishers (
   publisher_id BIGSERIAL PRIMARY KEY,
   publisher_name VARCHAR(100) NOT NULL,
   logo_url VARCHAR(500),
   description TEXT,
   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.books (
  book_id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  cover_image_url VARCHAR(500),
  language VARCHAR(50),
  published_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  publisher_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_books_publishers
      FOREIGN KEY (publisher_id)
          REFERENCES public.publishers(publisher_id)
);

CREATE TABLE public.book_authors (
 book_id BIGINT NOT NULL,
 author_id BIGINT NOT NULL,

 PRIMARY KEY (book_id, author_id),

 CONSTRAINT fk_book_authors_book
     FOREIGN KEY (book_id)
         REFERENCES public.books(book_id)
         ON DELETE CASCADE,

 CONSTRAINT fk_book_authors_author
     FOREIGN KEY (author_id)
         REFERENCES public.authors(author_id)
);

CREATE TABLE public.book_categories (
book_id BIGINT NOT NULL,
category_id BIGINT NOT NULL,

PRIMARY KEY (book_id, category_id),

CONSTRAINT fk_book_categories_book
    FOREIGN KEY (book_id)
        REFERENCES public.books(book_id)
        ON DELETE CASCADE,

CONSTRAINT fk_book_categories_category
    FOREIGN KEY (category_id)
        REFERENCES public.categories(category_id)
);

CREATE TABLE public.book_formats (
 book_format_id BIGSERIAL PRIMARY KEY,
 book_id BIGINT NOT NULL,
 format_type VARCHAR(20) NOT NULL,
 storage_url VARCHAR(500) NOT NULL,
 mime_type VARCHAR(100) NOT NULL,
 file_size BIGINT NOT NULL,
 is_primary BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

 CONSTRAINT fk_book_formats_books
     FOREIGN KEY (book_id)
         REFERENCES public.books(book_id)
);

CREATE UNIQUE INDEX uq_book_primary_format
    ON public.book_formats(book_id)
    WHERE is_primary = TRUE;