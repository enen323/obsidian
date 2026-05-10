# Obsidian — 软件实操教程站 设计文档

## 概述

Obsidian 是一个多领域软件实操教程网站，采用 Next.js + MDX 构建，部署于 Vercel。定位为免费教程 + 
联盟营销 (affiliate links) 模式，覆盖中英双语用户。

## 技术栈

| 层 | 选择 | 原因 |
|----|------|------|
| 框架 | Next.js (App Router) | Vercel 原生支持, SSG+SSR 混合, 优秀 SEO |
| 内容 | MDX | 文件即内容, git 管理, 零数据库成本 |
| 样式 | Tailwind CSS | 轻量, 开发效率高 |
| 双语 | next-intl | 成熟 i18n 库, 文件路由级国际化 |
| 部署 | Vercel (Hobby 免费版) | 自动部署, 免费 SSL/CDN |
| 域名 | NameSilo / Namecheap (~$10/年) | 便宜, 稳定 |

## 内容架构

### 内容模型

教程文章以 MDX 文件存储, 位于项目根目录 `posts/` (同级 `src/`, `public/`), 目录结构映射领域/软件/语言:

```
posts/
├── zh/
│   ├── design/
│   │   ├── photoshop/
│   │   │   └── basics.mdx
│   │   └── figma/
│   │       └── intro.mdx
│   └── dev/
│       └── vscode/
│           └── setup.mdx
└── en/
    ├── design/
    │   ├── photoshop/
    │   │   └── basics.mdx
    │   └── figma/
    │       └── intro.mdx
    └── dev/
        └── vscode/
            └── setup.mdx
```

### Frontmatter 结构

每篇 MDX:

```yaml
---
title: Photoshop 快速入门
description: 从零开始学 Photoshop 基础操作
field: design
software: photoshop
level: beginner
language: zh
slug: basics
date: 2026-05-10
readTime: 15
translationOf: /en/design/photoshop/basics    # 关联双语版本
featured: true
affiliateLinks:
  - name: Adobe Creative Cloud
    url: https://adobe.prf.hn/click/camref:xxxx
    description: 通过专属链接购买享折扣
    vendor: Adobe
  - name: Setapp
    url: https://setapp.sjv.io/xxxx
    description: 200+ Mac 应用订阅
    vendor: Setapp
---
```

### 分类法 (Taxonomy 通过目录 + frontmatter)

- **领域 (field):** design, dev, office, productivity, video, ai
- **软件 (software):** 各领域下具体软件名
- **难度 (level):** beginner, intermediate, advanced

## 路由设计

```
/                           → 重定向到 /zh 或 /en
/[lang]                     → 首页
/[lang]/[field]             → 领域聚合页
/[lang]/[field]/[software]  → 软件聚合页
/[lang]/[field]/[software]/[slug]  → 教程正文
/[lang]/about               → 关于
/[lang]/privacy             → 隐私政策
```

## 页面布局

### 首页
- Hero 区: 推荐教程 + 快速导航
- 领域网格: 6 个领域入口 (图标 + 名称 + 教程数)
- 最新教程列表
- 热门工具推荐 (affiliate placement)
- Footer: 免责声明 + 社交链接

### 文章页 (三栏布局)
- 左: 目录 (TOC, 基于 heading 自动生成)
- 中: 正文 (MDX 渲染, 含代码块/图片/提示框)
- 右: 侧边栏 — 相关教程 + Affiliate 推广块 (显眼位置) + 难度标签
- 文章底部: Affiliate 免责声明 + 相关工具推荐
- 语言切换: Header 中 EN/ZH 切换按钮

### 领域/软件页
- 教程卡片列表 (标题/描述/难度/阅读时间)
- 排序: 最新 / 热门
- 筛选: 按难度 / 软件

## 组件结构

```
src/
├── app/
│   ├── [lang]/
│   │   ├── layout.tsx         # 语言布局 (Header/Footer)
│   │   ├── page.tsx           # 首页
│   │   ├── [field]/
│   │   │   ├── page.tsx       # 领域页
│   │   │   └── [software]/
│   │   │       ├── page.tsx   # 软件页
│   │   │       └── [slug]/
│   │   │           └── page.tsx  # 文章页
│   │   ├── about/page.tsx
│   │   └── privacy/page.tsx
│   └── layout.tsx             # 根布局 (font, metadata, analytics)
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   └── language-switcher.tsx
│   ├── affiliate/
│   │   ├── affiliate-banner.tsx
│   │   ├── affiliate-disclaimer.tsx
│   │   └── tool-recommendation.tsx
│   ├── ui/
│   │   ├── toc.tsx            # 目录
│   │   ├── tutorial-card.tsx
│   │   ├── field-grid.tsx
│   │   └── badge.tsx          # 难度标签
│   └── mdx/
│       ├── mdx-layout.tsx     # MDX 包装器
│       └── components.tsx     # 自定义 MDX 组件
├── lib/
│   ├── posts.ts               # MDX 读取/解析
│   ├── affiliate.ts           # 链接工具函数
│   └── utils.ts
├── i18n.ts                    # next-intl 配置
└── styles/
    └── globals.css
```

## 数据流

1. 构建时: `lib/posts.ts` 扫描 `posts/` 目录, 解析 frontmatter, 生成静态路由
2. 文章页: 直接读取对应 MDX 文件, 通过 next-intl 处理双语上下文
3. 搜索/筛选: 客户端 Fuse.js 全文搜索, 按领域/难度/软件筛选
4. 邮件订阅: API 路由调用 Mailchimp / ConvertKit
5. 评论: Giscus (GitHub Discussions 驱动, 免费无广告)
6. Affiliate 链接: frontmatter 数据 → 组件渲染 → 用户点击 → 跳转联盟

## Affiliate 策略

- 每篇文章底部固定 affiliate 免责声明
- 侧边栏显眼位置展示相关工具推广
- 链接全部使用 `rel="sponsored nofollow"` 指向厂商联盟
- 符合 FTC 和中国广告法披露要求
- 推荐工具与教程内容强关联 (例如 PS 教程推 Adobe 套餐)

## 部署流程

1. 本地开发: `npm run dev`
2. 内容编辑: 改 `posts/` 下 MDX 文件
3. 提交: `git push main`
4. Vercel 自动检测, 构建, 部署
5. 域名指向 Vercel DNS

## SEO 策略

- 每页 dynamic metadata (title, description, OG image)
- 结构化数据 (Article, SoftwareApplication Schema)
- 自动 sitemap.xml
- 中文/英文页面 canonical 互指
- 静态生成 + ISR 保证首屏速度

## 功能清单 (V1)

- 双语首页 + 领域/软件聚合页
- 教程文章阅读 (MDX 渲染 + TOC)
- 按领域/难度/软件筛选
- Fuse.js 客户端搜索
- Affiliate 链接展示 + 免责声明
- 邮件订阅
- Giscus 评论系统
- 语言切换
- SEO (metadata, sitemap, schema)
- 响应式设计

## 后续扩展 (V2)

- 会员区域 / 进阶付费内容
- 数据分析 (Plausible / Umami)
