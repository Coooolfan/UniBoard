CREATE TABLE public.profile
(
    id                   BIGSERIAL PRIMARY KEY,
    name                 TEXT  NOT NULL,
    description          TEXT  NOT NULL,
    slogan               TEXT  NOT NULL,
    contacts             jsonb NOT NULL,
    custom_font_filename TEXT,
    custom_font_filepath TEXT,
    avatar_name          TEXT  NOT NULL,
    avatar_path          TEXT  NOT NULL,
    banner_name          TEXT  NOT NULL,
    banner_path          TEXT  NOT NULL,
    login_password       TEXT  NOT NULL,
    login_name           TEXT  NOT NULL
);

CREATE TABLE public.short_url
(
    id          BIGSERIAL PRIMARY KEY,
    long_url    TEXT             NOT NULL,
    short_url   TEXT             NOT NULL,
    visit_count BIGINT DEFAULT 0 NOT NULL,
    constraint short_url_unique_keys
        UNIQUE (short_url)
);

CREATE TABLE public.system_config
(
    id              BIGSERIAL PRIMARY KEY,
    host            TEXT    NOT NULL,
    show_profile    BOOLEAN NOT NULL,
    show_copy_right BOOLEAN NOT NULL
);

CREATE TABLE public.note
(
    id      BIGSERIAL PRIMARY KEY,
    title   TEXT NOT NULL,
    content TEXT NOT NULL
);

CREATE TABLE public.hyper_link
(
    id          BIGSERIAL PRIMARY KEY,
    title       TEXT                   NOT NULL,
    description TEXT                   NOT NULL,
    url         TEXT                   NOT NULL,
    color       TEXT DEFAULT '#f2f2f2' NOT NULL,
    filename    TEXT                   NOT NULL,
    filepath    TEXT                   NOT NULL
);

CREATE TABLE public.file_record
(
    id             BIGSERIAL PRIMARY KEY,
    filename       TEXT             NOT NULL,
    filepath       TEXT             NOT NULL,
    share_code     TEXT             NOT NULL,
    description    TEXT             NOT NULL,
    download_count BIGINT DEFAULT 0 NOT NULL,
    visibility     TEXT             NOT NULL,
    password       TEXT             NOT NULL,
    constraint file_record_unique_keys
        UNIQUE (share_code)
);