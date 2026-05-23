-- 为hyper_link表添加是否公开字段
-- 版本：0.4.1

-- 添加是否公开字段（is_public），默认值为true
ALTER TABLE public.hyper_link
    ADD COLUMN public BOOLEAN NOT NULL DEFAULT TRUE;
