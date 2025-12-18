create extension if not exists citext;

create table public.user
(
    id         uuid primary key not null,
    first_name citext           not null,
    last_name  citext,
    email      citext           not null,
    password   text             not null,
    is_online     boolean           not null default false,
    created_at timestamptz      not null default now(),
    created_by uuid             not null,
    updated_at timestamptz,
    updated_by uuid
);

create table public.admin
(
    id         uuid primary key not null,
    first_name citext           not null,
    last_name  citext,
    email      citext           not null,
    password   text             not null,
    created_at timestamptz      not null default now(),
    updated_at timestamptz
);

create table public.role
(
    id         serial      not null primary key,
    name       citext      not null,
    is_active  boolean     not null default true,
    is_root    boolean     not null default false,
    created_at timestamptz not null default now(),
    created_by uuid        not null references public.admin,
    updated_at timestamptz,
    updated_by uuid references public.admin
);

create table public.user_role
(
    user_id    uuid        not null references public.user,
    role_id    integer     not null references role,
    created_at timestamptz not null default now(),
    created_by uuid        not null references public.admin,
    updated_at timestamptz,
    updated_by uuid references public.admin,
    primary key (user_id, role_id)
);

insert into public.admin(id, first_name, email, password)
values ('5f4b5daa-7e0b-4700-9a42-0414974d2fbe', 'Admin', 'admin@gmail.com',
        '$2a$12$OH0FacunXhWb9VDJQyRWVuoKDr9z0n7LbXgUr33V7nV1X1UOxmM1m');

insert into public.role (name, created_by, is_active,is_root)
values ('Admin', '5f4b5daa-7e0b-4700-9a42-0414974d2fbe', true,true),
       ('User', '5f4b5daa-7e0b-4700-9a42-0414974d2fbe', true,true);
