CREATE TABLE public.refresh_token (
  refresh_token_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,


  CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id)
      REFERENCES public.users (user_id) ON DELETE CASCADE
);
