-- 为hyper_link表添加排序字段
-- 版本：0.4.1

-- 添加排序字段（sort），默认值为0
ALTER TABLE public.hyper_link
    ADD COLUMN sort INTEGER NOT NULL DEFAULT 0;

-- 为现有数据设置一个初始的、有序的排序值（基于id）
UPDATE public.hyper_link
SET sort = h.row_num
FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS row_num
      FROM public.hyper_link) AS h
WHERE public.hyper_link.id = h.id;


-- 创建序列，用于为新插入的行生成默认的sort值
CREATE SEQUENCE public.hyper_link_sort_seq;

-- 同步序列的起始值，使其大于当前已存在的最大sort值
-- 确保新插入的数据排在现有数据之后
SELECT setval('public.hyper_link_sort_seq',
              COALESCE((SELECT MAX(sort) FROM public.hyper_link), 1),
              (SELECT MAX(sort) IS NOT NULL FROM public.hyper_link));

-- 设置列的默认值，使其在插入新数据时自动从序列获取值
ALTER TABLE public.hyper_link
    ALTER COLUMN sort SET DEFAULT nextval('public.hyper_link_sort_seq'::regclass);