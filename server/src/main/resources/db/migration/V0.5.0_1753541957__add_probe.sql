-- 创建与探针相关的表服务
-- 版本：0.5.0

CREATE TABLE public.probe_target
(
    id               BIGSERIAL PRIMARY KEY,
    name             TEXT             NOT NULL,
    description      TEXT             NOT NULL,
    sort SERIAL NOT NULL,
    key              TEXT             NOT NULL,
    latitude         DOUBLE PRECISION NOT NULL,
    longitude        DOUBLE PRECISION NOT NULL,
    last_report_data JSONB,
    last_report_time TIMESTAMPTZ      NOT NULL DEFAULT to_timestamp(0),
    UNIQUE (key, name)
);
