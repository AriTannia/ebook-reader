CREATE TABLE public.user_roles (
   user_id BIGINT NOT NULL,
   role_id INTEGER NOT NULL,
   PRIMARY KEY (user_id, role_id),
   CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (user_id) ON DELETE CASCADE,
   CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES public.roles (id) ON DELETE CASCADE
);