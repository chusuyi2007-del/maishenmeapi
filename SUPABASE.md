# Supabase 设置指南

## 1. 创建 Supabase 项目

1. 访问 https://supabase.com 并登录
2. 点击 "New Project" 创建新项目
3. 填写项目名称和数据库密码

## 2. 创建 reviews 表

在 SQL Editor 中执行：

```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  zh TEXT NOT NULL,
  en TEXT,
  store TEXT NOT NULL,
  zip TEXT,
  stars INTEGER DEFAULT 0,
  sentiment TEXT DEFAULT 'good',
  text TEXT,
  photo TEXT,
  votes JSONB DEFAULT '{"up": 0, "down": 0}',
  comments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS (Row Level Security)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 允许匿名读取
CREATE POLICY "Allow anonymous read" ON reviews
  FOR SELECT USING (true);

-- 允许匿名插入
CREATE POLICY "Allow anonymous insert" ON reviews
  FOR INSERT WITH CHECK (true);

-- 允许匿名更新（投票、评论）
CREATE POLICY "Allow anonymous update" ON reviews
  FOR UPDATE USING (true);
```

## 3. 获取 API 密钥

1. 进入 Project Settings > API
2. 复制 **URL** 和 **anon public** key

## 4. 配置前端

在 `index.html` 中找到以下代码并填入：

```js
const SUPABASE_URL = 'https://你的项目ID.supabase.co';
const SUPABASE_ANON_KEY = '你的anon-key';
```

## 表结构说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键，自动生成 |
| zh | TEXT | 食材中文名 |
| en | TEXT | 食材英文名 |
| store | TEXT | 超市名称 |
| zip | TEXT | 邮编 |
| stars | INTEGER | 星级 1-5 |
| sentiment | TEXT | 'good' 或 'bad' |
| text | TEXT | 评价内容 |
| photo | TEXT | 图片 base64 |
| votes | JSONB | 投票数据 |
| comments | JSONB | 评论数组 |
| created_at | TIMESTAMPTZ | 创建时间 |
