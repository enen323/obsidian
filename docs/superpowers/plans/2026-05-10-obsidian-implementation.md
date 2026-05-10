# Obsidian Tutorial Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build bilingual (zh/en) tutorial website with affiliate marketing, deployed on Vercel.

**Architecture:** Next.js 15 App Router + MDX content files at `posts/` dir. Static site generation at build time. Bilingual via next-intl with `[lang]` route segment. Content parsed from frontmatter + directory structure. Client-side search via Fuse.js.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, next-intl, MDX, Fuse.js, Giscus, Vercel

---

## File Structure

```
obsidian/
├── posts/                          # MDX content files
│   ├── zh/                         # Chinese content
│   │   └── design/
│   │       └── photoshop/
│   │           └── basics.mdx      # Sample tutorial
│   └── en/                         # English content (mirror)
│       └── design/
│           └── photoshop/
│               └── basics.mdx
├── src/
│   ├── app/
│   │   ├── [lang]/
│   │   │   ├── layout.tsx          # Language layout: Header + Footer + children
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── [field]/
│   │   │   │   ├── page.tsx        # Field listing (e.g. /zh/design)
│   │   │   │   └── [software]/
│   │   │   │       ├── page.tsx    # Software listing (e.g. /zh/design/photoshop)
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx  # Tutorial article
│   │   │   ├── about/page.tsx      # About page
│   │   │   └── privacy/page.tsx    # Privacy policy
│   │   ├── layout.tsx              # Root layout: fonts, metadata, analytics
│   │   ├── sitemap.ts              # Dynamic sitemap
│   │   └── robots.ts               # Robots config
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx          # Site header (logo, nav, search, lang switch)
│   │   │   ├── footer.tsx          # Site footer (links, disclaimer, social)
│   │   │   ├── sidebar.tsx         # Article sidebar (related, affiliate)
│   │   │   └── language-switcher.tsx  # ZH/EN toggle
│   │   ├── affiliate/
│   │   │   ├── affiliate-banner.tsx       # Inline affiliate promotion
│   │   │   ├── affiliate-disclaimer.tsx   # Legal disclaimer text
│   │   │   └── tool-recommendation.tsx    # Sidebar tool card
│   │   ├── ui/
│   │   │   ├── toc.tsx             # Table of contents from headings
│   │   │   ├── tutorial-card.tsx   # Listing card for a tutorial
│   │   │   ├── field-grid.tsx      # Homepage field grid
│   │   │   └── badge.tsx           # Level/field badge
│   │   ├── mdx/
│   │   │   ├── mdx-layout.tsx      # MDX content wrapper
│   │   │   └── components.tsx      # Custom MDX component registry
│   │   └── search-dialog.tsx       # Client-side search modal
│   ├── lib/
│   │   ├── posts.ts                # MDX parsing, directory scan, type definitions
│   │   ├── affiliate.ts            # Affiliate link utilities
│   │   └── utils.ts                # Shared helpers (cn, etc.)
│   ├── types.ts                    # Shared TypeScript types
│   └── styles/
│       └── globals.css             # Tailwind directives + global styles
├── messages/
│   ├── zh.json                     # Chinese UI strings
│   └── en.json                     # English UI strings
├── i18n/
│   └── request.ts                  # next-intl request config
├── next.config.ts                  # Next.js + next-intl plugin
├── middleware.ts                   # next-intl routing middleware
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── package.json
└── .gitignore
```

---

### Phase 0: Cleanup & Project Init

### Task 0.1: Delete Java files, init Next.js project

**Files:**
- Delete: `pom.xml`, `src/main/`, `target/`
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.js`, `tailwind.config.ts`, `.gitignore`

- [ ] **Step 1: Remove existing Java files**

Run:
```bash
rm -f pom.xml
rm -rf src/main target
```

Expected: `src/` and `target/` gone, only `docs/` remains.

- [ ] **Step 2: Create Next.js project config**

```bash
cat > package.json << 'JSONEOF'
{
  "name": "obsidian",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.3.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "next-intl": "^4.1.0",
    "@tailwindcss/postcss": "^4.1.0",
    "tailwindcss": "^4.1.0",
    "fuse.js": "^7.1.0",
    "gray-matter": "^4.0.3",
    "next-mdx-remote": "^5.0.0",
    "rehype-highlight": "^7.0.0",
    "rehype-slug": "^6.0.0",
    "remark-gfm": "^4.0.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.2.0",
    "lucide-react": "^0.510.0"
  },
  "devDependencies": {
    "@types/node": "^22.15.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "typescript": "^5.8.0"
  }
}
JSONEOF
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create postcss.config.js**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

- [ ] **Step 5: Create tailwind.config.ts**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./posts/**/*.mdx"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#dbe4ff",
          500: "#4f6ef7",
          600: "#3b5bdb",
          700: "#2b4ac7",
        },
      },
    },
  },
};
export default config;
```

- [ ] **Step 6: Create .gitignore**

```
node_modules/
.next/
out/
.env.local
.env*.local
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 7: Create src/styles/globals.css**

```css
@import "tailwindcss";

@layer base {
  :root {
    --color-brand-50: #f0f4ff;
    --color-brand-100: #dbe4ff;
    --color-brand-500: #4f6ef7;
    --color-brand-600: #3b5bdb;
    --color-brand-700: #2b4ac7;
  }
}

@layer components {
  .prose-custom {
    max-width: 72ch;
    line-height: 1.75;
  }
  .prose-custom p { margin-bottom: 1.25em; }
  .prose-custom h2 { margin-top: 2em; margin-bottom: 0.75em; font-size: 1.5rem; font-weight: 700; }
  .prose-custom h3 { margin-top: 1.5em; margin-bottom: 0.5em; font-size: 1.25rem; font-weight: 600; }
  .prose-custom pre { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
  .prose-custom code { font-size: 0.875em; }
  .prose-custom img { border-radius: 0.5rem; margin: 1.5rem 0; }
  .prose-custom ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25em; }
  .prose-custom ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25em; }
}
```

- [ ] **Step 8: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, `package-lock.json` generated.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: init Next.js project structure"
```

---

### Task 0.2: Set up next-intl (i18n)

**Files:**
- Create: `messages/zh.json`, `messages/en.json`
- Create: `i18n/request.ts`
- Create: `middleware.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Create Chinese messages file**

```json
{
  "nav": {
    "home": "首页",
    "about": "关于",
    "privacy": "隐私政策",
    "search": "搜索教程..."
  },
  "home": {
    "heroTitle": "软件实操教程",
    "heroSubtitle": "从入门到精通, 免费学习各类软件操作技巧",
    "fields": "领域分类",
    "latestTutorials": "最新教程",
    "recommendedTools": "推荐工具",
    "viewAll": "查看全部"
  },
  "field": {
    "design": "设计",
    "dev": "开发",
    "office": "办公",
    "productivity": "效率",
    "video": "视频",
    "ai": "人工智能",
    "all": "全部分类"
  },
  "article": {
    "readTime": "{minutes} 分钟阅读",
    "relatedTutorials": "相关教程",
    "tableOfContents": "目录",
    "level": "难度",
    "beginner": "入门",
    "intermediate": "中级",
    "advanced": "高级",
    "affiliateDisclaimer": "本站部分链接为联盟链接, 通过购买产品您将支持本站且无需额外费用。",
    "recommendedTool": "推荐工具"
  },
  "footer": {
    "description": "免费软件实操教程平台, 助你掌握各类软件技能。",
    "affiliateDisclaimer": "部分链接为联盟链接, 购买产品将支持本站运营。"
  }
}
```

- [ ] **Step 2: Create English messages file**

```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "privacy": "Privacy",
    "search": "Search tutorials..."
  },
  "home": {
    "heroTitle": "Software Tutorials",
    "heroSubtitle": "Learn software skills for free, from beginner to advanced",
    "fields": "Categories",
    "latestTutorials": "Latest Tutorials",
    "recommendedTools": "Recommended Tools",
    "viewAll": "View All"
  },
  "field": {
    "design": "Design",
    "dev": "Development",
    "office": "Office",
    "productivity": "Productivity",
    "video": "Video",
    "ai": "AI",
    "all": "All Categories"
  },
  "article": {
    "readTime": "{minutes} min read",
    "relatedTutorials": "Related Tutorials",
    "tableOfContents": "Table of Contents",
    "level": "Level",
    "beginner": "Beginner",
    "intermediate": "Intermediate",
    "advanced": "Advanced",
    "affiliateDisclaimer": "Some links on this site are affiliate links. We may earn a commission at no extra cost to you.",
    "recommendedTool": "Recommended Tool"
  },
  "footer": {
    "description": "Free software tutorial platform. Master software skills with practical guides.",
    "affiliateDisclaimer": "Some links are affiliate links. Purchases support this site's operation."
  }
}
```

- [ ] **Step 3: Create i18n/request.ts**

```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

export const locales = ["zh", "en"];
export const defaultLocale = "zh";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 4: Create middleware.ts**

```ts
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/request";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 5: Update next.config.ts**

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Create i18n type declarations**

Create `src/types.ts`:
```ts
export interface AffiliateLink {
  name: string;
  url: string;
  description: string;
  vendor: string;
}

export interface TutorialMeta {
  title: string;
  description: string;
  field: string;
  software: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  slug: string;
  date: string;
  readTime: number;
  translationOf?: string;
  featured?: boolean;
  affiliateLinks?: AffiliateLink[];
}

export interface TutorialPost extends TutorialMeta {
  path: string;         // filesystem path
  url: string;          // full URL path
  content: string;      // raw MDX content
}

export interface FieldInfo {
  key: string;
  name: string;
  icon: string;
  count: number;
}
```

- [ ] **Step 7: Verify build passes**

```bash
npx next build
```

Expected: Build succeeds (may show warnings, no errors). If errors, fix imports.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add next-intl i18n with zh/en locales"
```

---

### Phase 1: Content Engine

### Task 1.1: Create posts library

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/lib/posts.ts`

- [ ] **Step 1: Create shared utility**

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
```

- [ ] **Step 2: Create posts.ts — content loader**

```ts
// src/lib/posts.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { TutorialMeta, TutorialPost, FieldInfo, AffiliateLink } from "@/types";

const POSTS_DIR = path.join(process.cwd(), "posts");

export function getAllPosts(lang: string): TutorialPost[] {
  const langDir = path.join(POSTS_DIR, lang);
  if (!fs.existsSync(langDir)) return [];

  const results: TutorialPost[] = [];

  function walk(dir: string, field: string, software: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, field, entry.name);
      } else if (entry.name.endsWith(".mdx")) {
        const raw = fs.readFileSync(fullPath, "utf-8");
        const { data, content } = matter(raw);
        const meta = data as unknown as TutorialMeta;
        const slug = entry.name.replace(/\.mdx$/, "");
        results.push({
          ...meta,
          title: meta.title || slug,
          description: meta.description || "",
          field: meta.field || field,
          software: meta.software || software,
          level: meta.level || "beginner",
          language: lang,
          slug,
          date: meta.date || "2026-01-01",
          readTime: meta.readTime || 5,
          path: fullPath,
          url: `/${lang}/${meta.field || field}/${meta.software || software}/${slug}`,
          content,
        });
      }
    }
  }

  walk(langDir, "", "");
  results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return results;
}

export function getPostsByField(posts: TutorialPost[], field: string): TutorialPost[] {
  return posts.filter((p) => p.field === field);
}

export function getPostsBySoftware(posts: TutorialPost[], field: string, software: string): TutorialPost[] {
  return posts.filter((p) => p.field === field && p.software === software);
}

export function getFeaturedPosts(posts: TutorialPost[]): TutorialPost[] {
  return posts.filter((p) => p.featured);
}

export function getPostBySlug(posts: TutorialPost[], slug: string): TutorialPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllFields(posts: TutorialPost[]): FieldInfo[] {
  const fieldMap = new Map<string, { count: number; key: string }>();
  for (const p of posts) {
    const existing = fieldMap.get(p.field);
    if (existing) {
      existing.count++;
    } else {
      fieldMap.set(p.field, { count: 1, key: p.field });
    }
  }
  // Sort by most posts first
  return Array.from(fieldMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .map(([key, val]) => ({
      key,
      name: key,
      icon: getFieldIcon(key),
      count: val.count,
    }));
}

export function getFieldIcon(field: string): string {
  const icons: Record<string, string> = {
    design: "🎨",
    dev: "💻",
    office: "📊",
    productivity: "⚡",
    video: "🎬",
    ai: "🤖",
  };
  return icons[field] || "📁";
}

export function getRelatedPosts(posts: TutorialPost[], current: TutorialPost, limit = 4): TutorialPost[] {
  return posts
    .filter((p) => p.slug !== current.slug && (p.field === current.field || p.software === current.software))
    .slice(0, limit);
}

export function getAffiliateLinks(meta: TutorialMeta): AffiliateLink[] {
  return meta.affiliateLinks || [];
}

export function getAllSlugs(lang: string): { field: string; software: string; slug: string }[] {
  const posts = getAllPosts(lang);
  return posts.map((p) => ({ field: p.field, software: p.software, slug: p.slug }));
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add posts library with MDX parsing and content loading"
```

---

### Task 1.2: Create sample MDX content

**Files:**
- Create: `posts/zh/design/photoshop/basics.mdx`
- Create: `posts/en/design/photoshop/basics.mdx`

- [ ] **Step 1: Create Chinese sample tutorial**

Create `posts/zh/design/photoshop/basics.mdx`:
```mdx
---
title: Photoshop 快速入门
description: 从零开始学习 Photoshop 基础操作，掌握图层、选区、调色等核心功能
field: design
software: photoshop
level: beginner
language: zh
slug: basics
date: 2026-05-10
readTime: 15
featured: true
affiliateLinks:
  - name: Adobe Creative Cloud
    url: https://www.adobe.com
    description: 获取全套 Adobe 创意应用
    vendor: Adobe
  - name: Setapp
    url: https://setapp.com
    description: 200+ Mac 应用订阅，包含 Photoshop 替代品
    vendor: Setapp
---

## 什么是 Photoshop？

Adobe Photoshop 是全球最流行的图像编辑软件，广泛应用于平面设计、摄影后期、UI 设计等领域。

## 界面概览

打开 Photoshop 后，你会看到以下主要区域：

1. **菜单栏** - 顶部，包含文件、编辑、图层等菜单
2. **工具栏** - 左侧，包含选择、画笔、橡皮擦等工具
3. **选项栏** - 菜单栏下方，显示当前工具的选项
4. **面板区** - 右侧，包含图层、颜色、历史记录等面板
5. **画布** - 中央，你的工作区域

## 图层基础

图层是 Photoshop 最核心的概念。可以把图层想像成一张张透明的纸，你可以在每张纸上绘图，然后叠在一起形成完整的图像。

### 创建新图层

点击图层面板底部的"新建图层"按钮，或使用快捷键 `Ctrl+Shift+N`。

### 图层类型

- **普通图层** - 基本的透明图层
- **文本图层** - 包含可编辑文字
- **调整图层** - 应用颜色调整而不破坏原图
- **形状图层** - 矢量图形

## 选区工具

选区让你只编辑图像的特定部分。

### 矩形选框工具

按 `M` 键选择，拖动创建矩形选区。按住 `Shift` 创建正方形。

### 套索工具

按 `L` 键选择，自由绘制选区边界。

### 魔棒工具

按 `W` 键选择，点击相似颜色区域自动创建选区。

## 保存和导出

- **PSD** - 源文件格式，保留所有图层信息
- **PNG** - 支持透明背景，适合网页使用
- **JPEG** - 文件小，适合照片分享
- **WebP** - 现代网页格式，压缩率更高

---

以上就是 Photoshop 的入门操作。掌握这些基础后，你可以开始尝试简单的设计项目了。
```

- [ ] **Step 2: Create English sample tutorial**

Create `posts/en/design/photoshop/basics.mdx`:
```mdx
---
title: Photoshop Quick Start
description: Learn Photoshop basics from scratch — layers, selections, color adjustments
field: design
software: photoshop
level: beginner
language: en
slug: basics
date: 2026-05-10
readTime: 15
featured: true
translationOf: /zh/design/photoshop/basics
affiliateLinks:
  - name: Adobe Creative Cloud
    url: https://www.adobe.com
    description: Get the full suite of Adobe creative apps
    vendor: Adobe
  - name: Setapp
    url: https://setapp.com
    description: 200+ Mac apps subscription with Photoshop alternatives
    vendor: Setapp
---

## What is Photoshop?

Adobe Photoshop is the world's most popular image editing software, widely used in graphic design, photography post-production, and UI design.

## Interface Overview

When you open Photoshop, you'll see these main areas:

1. **Menu Bar** - Top, contains File, Edit, Layer, etc.
2. **Toolbar** - Left, contains selection, brush, eraser tools
3. **Options Bar** - Below menu bar, shows current tool options
4. **Panels** - Right, contains Layers, Color, History panels
5. **Canvas** - Center, your working area

## Layer Basics

Layers are Photoshop's core concept. Think of them as transparent sheets — you draw on each sheet and stack them to form the complete image.

### Creating a New Layer

Click the "New Layer" button at the bottom of the Layers panel, or use `Ctrl+Shift+N`.

### Layer Types

- **Regular Layer** - Basic transparent layer
- **Text Layer** - Contains editable text
- **Adjustment Layer** - Apply color adjustments non-destructively
- **Shape Layer** - Vector graphics

## Selection Tools

Selections let you edit specific parts of an image.

### Rectangular Marquee Tool

Press `M`, then drag to create a rectangular selection. Hold `Shift` for a perfect square.

### Lasso Tool

Press `L` to draw freeform selection boundaries.

### Magic Wand Tool

Press `W` to auto-create selections by clicking similar color areas.

## Save & Export

- **PSD** - Source format, preserves all layers
- **PNG** - Supports transparent backgrounds, good for web
- **JPEG** - Small file size, good for photo sharing
- **WebP** - Modern web format, better compression

---

That covers the Photoshop basics. With these fundamentals, you can start working on simple design projects.
```

- [ ] **Step 3: Create post directory placeholder for more content**

```bash
mkdir -p posts/zh/design/figma posts/zh/dev/vscode
mkdir -p posts/en/design/figma posts/en/dev/vscode
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add sample MDX tutorial content (zh/en)"
```

---

### Phase 2: Layout Foundation

### Task 2.1: Root layout and [lang] layout

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/[lang]/layout.tsx`
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/footer.tsx`

- [ ] **Step 1: Create root layout**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "Obsidian — 软件实操教程", template: "%s | Obsidian" },
  description: "免费软件实操教程平台 — Photoshop, VS Code, Figma 等软件教程",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const messages = await getMessages();
  return (
    <html lang={lang}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create [lang]/layout.tsx with Header/Footer**

```tsx
// src/app/[lang]/layout.tsx
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={lang} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}
```

- [ ] **Step 3: Create Header component**

```tsx
// src/components/layout/header.tsx
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";

export default function Header({ lang }: { lang: string }) {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href={`/${lang}`} className="flex items-center gap-2 text-xl font-bold text-brand-600">
          <span>◆</span>
          <span>Obsidian</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href={`/${lang}`} className="text-sm font-medium text-gray-600 hover:text-brand-600">
            {t("home")}
          </Link>
          <Link href={`/${lang}/about`} className="text-sm font-medium text-gray-600 hover:text-brand-600">
            {t("about")}
          </Link>
          <LanguageSwitcher lang={lang} />
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Create Footer component**

```tsx
// src/components/layout/footer.tsx
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer({ lang }: { lang: string }) {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 text-lg font-bold text-brand-600">
            <span>◆</span>
            <span>Obsidian</span>
          </div>
          <p className="max-w-md text-sm text-gray-500">{t("description")}</p>
          <p className="max-w-lg text-xs text-gray-400">{t("affiliateDisclaimer")}</p>
          <nav className="flex gap-6 text-sm text-gray-500">
            <Link href={`/${lang}`}>Home</Link>
            <Link href={`/${lang}/about`}>About</Link>
            <Link href={`/${lang}/privacy`}>Privacy</Link>
          </nav>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Obsidian.</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
npx next build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add root layout, header, footer"
```

---

### Task 2.2: Language switcher component

**Files:**
- Create: `src/components/layout/language-switcher.tsx`

- [ ] **Step 1: Create LanguageSwitcher**

```tsx
// src/components/layout/language-switcher.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LanguageSwitcher({ lang }: { lang: string }) {
  const pathname = usePathname();
  const targetLang = lang === "zh" ? "en" : "zh";
  const label = lang === "zh" ? "EN" : "中文";

  // Replace the lang segment in the path
  const segments = pathname.split("/");
  segments[1] = targetLang;
  const targetPath = segments.join("/");

  return (
    <Link
      href={targetPath}
      className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:border-brand-500 hover:text-brand-600"
    >
      {label}
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add language switcher component"
```

---

### Phase 3: Page Implementation

### Task 3.1: Homepage

**Files:**
- Create: `src/app/[lang]/page.tsx`
- Create: `src/components/ui/field-grid.tsx`
- Create: `src/components/ui/tutorial-card.tsx`

- [ ] **Step 1: Create Badge component**

```tsx
// src/components/ui/badge.tsx
import { cn } from "@/lib/utils";

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export default function Badge({
  level,
  className,
}: {
  level: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
        levelColors[level] || "bg-gray-100 text-gray-700",
        className,
      )}
    >
      {level}
    </span>
  );
}
```

- [ ] **Step 2: Create TutorialCard component**

```tsx
// src/components/ui/tutorial-card.tsx
import Link from "next/link";
import { useTranslations } from "next-intl";
import Badge from "./badge";
import type { TutorialPost } from "@/types";

export default function TutorialCard({
  post,
  lang,
}: {
  post: TutorialPost;
  lang: string;
}) {
  const t = useTranslations("article");

  return (
    <Link
      href={`/${lang}/${post.field}/${post.software}/${post.slug}`}
      className="group block rounded-lg border border-gray-200 p-4 transition hover:border-brand-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-600">
          {post.title}
        </h3>
        <Badge level={post.level} className="shrink-0" />
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
        {post.description}
      </p>
      <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
        <span>{post.software}</span>
        <span>{t("readTime", { minutes: post.readTime })}</span>
        <span>{post.date}</span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Create FieldGrid component**

```tsx
// src/components/ui/field-grid.tsx
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { FieldInfo } from "@/types";

export default function FieldGrid({
  fields,
  lang,
}: {
  fields: FieldInfo[];
  lang: string;
}) {
  const t = useTranslations("field");

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
      {fields.map((field) => (
        <Link
          key={field.key}
          href={`/${lang}/${field.key}`}
          className="flex flex-col items-center rounded-lg border border-gray-200 p-4 text-center transition hover:border-brand-300 hover:shadow-sm"
        >
          <span className="text-3xl">{field.icon}</span>
          <span className="mt-2 text-sm font-medium text-gray-700">
            {t(field.key as any) || field.name}
          </span>
          <span className="mt-0.5 text-xs text-gray-400">
            {field.count} {field.count > 1 ? "tutorials" : "tutorial"}
          </span>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create Homepage**

```tsx
// src/app/[lang]/page.tsx
import { useTranslations } from "next-intl";
import { getAllPosts, getAllFields, getFeaturedPosts } from "@/lib/posts";
import FieldGrid from "@/components/ui/field-grid";
import TutorialCard from "@/components/ui/tutorial-card";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const posts = getAllPosts(lang);
  const fields = getAllFields(posts);
  const featured = getFeaturedPosts(posts);
  const latest = posts.slice(0, 6);
  const th = useTranslations("home");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          {th("heroTitle")}
        </h1>
        <p className="mt-3 text-lg text-gray-500">{th("heroSubtitle")}</p>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {th("recommendedTools")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((post) => (
              <TutorialCard key={post.url} post={post} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* Fields */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {th("fields")}
        </h2>
        <FieldGrid fields={fields} lang={lang} />
      </section>

      {/* Latest */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {th("latestTutorials")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <TutorialCard key={post.url} post={post} lang={lang} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
npx next build
```

Expected: Build succeeds, homepage renders.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add homepage with featured, fields, latest tutorials"
```

---

### Task 3.2: Field and Software listing pages

**Files:**
- Create: `src/app/[lang]/[field]/page.tsx`
- Create: `src/app/[lang]/[field]/[software]/page.tsx`

- [ ] **Step 1: Create Field page**

```tsx
// src/app/[lang]/[field]/page.tsx
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getAllPosts, getPostsByField, getAllFields } from "@/lib/posts";
import TutorialCard from "@/components/ui/tutorial-card";

const VALID_FIELDS = ["design", "dev", "office", "productivity", "video", "ai"];

export async function generateStaticParams({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return VALID_FIELDS.map((field) => ({ field }));
}

export default async function FieldPage({
  params,
}: {
  params: Promise<{ lang: string; field: string }>;
}) {
  const { lang, field } = await params;
  if (!VALID_FIELDS.includes(field)) notFound();

  const allPosts = getAllPosts(lang);
  const posts = getPostsByField(allPosts, field);
  const ft = useTranslations("field");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        {ft(field as any) || field}
      </h1>
      <p className="mb-8 text-gray-500">{posts.length} tutorials</p>

      {posts.length === 0 ? (
        <p className="text-gray-400">No tutorials yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <TutorialCard key={post.url} post={post} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create Software page**

```tsx
// src/app/[lang]/[field]/[software]/page.tsx
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getAllPosts, getPostsBySoftware } from "@/lib/posts";
import TutorialCard from "@/components/ui/tutorial-card";

export default async function SoftwarePage({
  params,
}: {
  params: Promise<{ lang: string; field: string; software: string }>;
}) {
  const { lang, field, software } = await params;
  const allPosts = getAllPosts(lang);
  const posts = getPostsBySoftware(allPosts, field, software);

  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 capitalize">{software}</h1>
      <p className="mb-8 text-gray-500">{posts.length} tutorials</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <TutorialCard key={post.url} post={post} lang={lang} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npx next build
```

Expected: Build succeeds, field and software pages render.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add field and software listing pages"
```

---

### Task 3.3: Tutorial article page with MDX

**Files:**
- Create: `src/components/mdx/components.tsx`
- Create: `src/components/mdx/mdx-layout.tsx`
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/ui/toc.tsx`
- Create: `src/app/[lang]/[field]/[software]/[slug]/page.tsx`

- [ ] **Step 1: Create MDX custom components**

```tsx
// src/components/mdx/components.tsx
import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="sponsored nofollow" {...props}>
          {children}
        </a>
      );
    }
    return <Link href={href || "#"} {...props}>{children}</Link>;
  },
  pre: ({ children, ...props }) => (
    <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, ...props }) => (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-brand-700" {...props}>
      {children}
    </code>
  ),
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt || ""} className="rounded-lg" {...props} />
  ),
};
```

- [ ] **Step 2: Create TOC component**

```tsx
// src/components/ui/toc.tsx
"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function Toc() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = document.querySelectorAll(
      ".prose-custom h2, .prose-custom h3",
    );
    const tocItems: TocItem[] = Array.from(headings).map((h) => ({
      id: h.id,
      text: h.textContent || "",
      level: h.tagName === "H2" ? 2 : 3,
    }));
    setItems(tocItems);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-24">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Table of Contents
      </h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block text-sm transition ${
                item.level === 3 ? "pl-4" : ""
              } ${
                activeId === item.id
                  ? "font-medium text-brand-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 3: Create Sidebar component**

```tsx
// src/components/layout/sidebar.tsx
import { useTranslations } from "next-intl";
import { getRelatedPosts, getAffiliateLinks } from "@/lib/posts";
import type { TutorialPost } from "@/types";
import Badge from "@/components/ui/badge";
import ToolRecommendation from "@/components/affiliate/tool-recommendation";
import AffiliateDisclaimer from "@/components/affiliate/affiliate-disclaimer";

export default function Sidebar({
  post,
  allPosts,
  lang,
}: {
  post: TutorialPost;
  allPosts: TutorialPost[];
  lang: string;
}) {
  const t = useTranslations("article");
  const related = getRelatedPosts(allPosts, post);
  const affiliateLinks = getAffiliateLinks(post);

  return (
    <aside className="space-y-6">
      {/* Level badge */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {t("level")}
        </h4>
        <Badge level={post.level} />
      </div>

      {/* Affiliate tools */}
      {affiliateLinks.length > 0 && (
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t("recommendedTool")}
          </h4>
          <div className="space-y-3">
            {affiliateLinks.map((link, i) => (
              <ToolRecommendation key={i} link={link} />
            ))}
          </div>
          <div className="mt-2">
            <AffiliateDisclaimer />
          </div>
        </div>
      )}

      {/* Related tutorials */}
      {related.length > 0 && (
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t("relatedTutorials")}
          </h4>
          <div className="space-y-3">
            {related.map((r) => (
              <a
                key={r.url}
                href={`/${lang}/${r.field}/${r.software}/${r.slug}`}
                className="block text-sm text-gray-600 hover:text-brand-600"
              >
                {r.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
```

- [ ] **Step 4: Create Affiliate disclaimer component**

```tsx
// src/components/affiliate/affiliate-disclaimer.tsx
import { useTranslations } from "next-intl";

export default function AffiliateDisclaimer() {
  const t = useTranslations("article");
  return (
    <p className="text-xs text-gray-400 italic">
      {t("affiliateDisclaimer")}
    </p>
  );
}
```

- [ ] **Step 5: Create ToolRecommendation component**

```tsx
// src/components/affiliate/tool-recommendation.tsx
import type { AffiliateLink } from "@/types";

export default function ToolRecommendation({ link }: { link: AffiliateLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="sponsored nofollow"
      className="block rounded-lg border border-gray-200 p-3 transition hover:border-brand-300 hover:shadow-sm"
    >
      <div className="font-medium text-sm text-gray-900">{link.name}</div>
      <div className="mt-0.5 text-xs text-gray-500">{link.description}</div>
      <div className="mt-1 text-xs text-brand-600">{link.vendor} →</div>
    </a>
  );
}
```

- [ ] **Step 6: Create MDX layout (content wrapper with TOC + sidebar)**

```tsx
// src/components/mdx/mdx-layout.tsx
import Toc from "@/components/ui/toc";
import Sidebar from "@/components/layout/sidebar";
import AffiliateDisclaimer from "@/components/affiliate/affiliate-disclaimer";
import { formatDate } from "@/lib/utils";
import type { TutorialPost } from "@/types";

export default function MdxLayout({
  post,
  allPosts,
  lang,
  children,
}: {
  post: TutorialPost;
  allPosts: TutorialPost[];
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Article header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span>{post.software}</span>
          <span>{post.readTime} min read</span>
          <span>{formatDate(post.date, lang)}</span>
        </div>
      </header>

      {/* Three-column layout */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* TOC - left */}
        <div className="hidden w-56 shrink-0 lg:block">
          <Toc />
        </div>

        {/* Content - center */}
        <article className="prose-custom min-w-0 flex-1">
          {children}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <AffiliateDisclaimer />
          </div>
        </article>

        {/* Sidebar - right */}
        <div className="w-full shrink-0 lg:w-72">
          <Sidebar post={post} allPosts={allPosts} lang={lang} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create article page (server component that renders MDX)**

```tsx
// src/app/[lang]/[field]/[software]/[slug]/page.tsx
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { mdxComponents } from "@/components/mdx/components";
import MdxLayout from "@/components/mdx/mdx-layout";

export async function generateStaticParams({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const posts = getAllPosts(lang);
  return posts.map((p) => ({
    field: p.field,
    software: p.software,
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; field: string; software: string; slug: string }>;
}) {
  const { lang, field, software, slug } = await params;
  const allPosts = getAllPosts(lang);
  const post = getPostBySlug(allPosts, slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/${lang}/${field}/${software}/${slug}`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; field: string; software: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const allPosts = getAllPosts(lang);
  const post = getPostBySlug(allPosts, slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
    components: mdxComponents,
  });

  return (
    <MdxLayout post={post} allPosts={allPosts} lang={lang}>
      {content}
    </MdxLayout>
  );
}
```

- [ ] **Step 8: Create AffiliateBanner component**

```tsx
// src/components/affiliate/affiliate-banner.tsx
import { useTranslations } from "next-intl";
import type { AffiliateLink } from "@/types";

export default function AffiliateBanner({ links }: { links: AffiliateLink[] }) {
  const t = useTranslations("article");

  if (links.length === 0) return null;

  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <p className="text-sm text-yellow-800">{t("affiliateDisclaimer")}</p>
      {links.length > 0 && (
        <div className="mt-2 space-y-1">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="sponsored nofollow"
              className="block text-sm font-medium text-yellow-700 underline hover:text-yellow-800"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 9: Verify build**

```bash
npx next build
```

Expected: Build succeeds, article page renders sample MDX content.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add MDX article rendering with TOC, sidebar, affiliate components"
```

---

### Task 3.4: Static pages — About + Privacy

**Files:**
- Create: `src/app/[lang]/about/page.tsx`
- Create: `src/app/[lang]/privacy/page.tsx`

- [ ] **Step 1: Create About page**

```tsx
// src/app/[lang]/about/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return {
    title: lang === "zh" ? "关于" : "About",
    description: lang === "zh" ? "关于 Obsidian 教程平台" : "About Obsidian Tutorials",
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isZh = lang === "zh";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        {isZh ? "关于 Obsidian" : "About Obsidian"}
      </h1>
      <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
        {isZh ? (
          <>
            <p>Obsidian 是一个免费的软件实操教程平台。</p>
            <p>我们提供 Photoshop、VS Code、Figma 等各类软件的实操教程，帮助用户快速掌握软件技能。</p>
            <p>本站部分链接为联盟营销链接。如果您通过我们的链接购买产品，我们可能会获得佣金，但您无需支付额外费用。</p>
          </>
        ) : (
          <>
            <p>Obsidian is a free software tutorial platform.</p>
            <p>We provide practical guides for Photoshop, VS Code, Figma, and more.</p>
            <p>Some links on this site are affiliate links. We may earn a commission at no extra cost to you.</p>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Privacy page**

```tsx
// src/app/[lang]/privacy/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return {
    title: lang === "zh" ? "隐私政策" : "Privacy Policy",
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isZh = lang === "zh";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        {isZh ? "隐私政策" : "Privacy Policy"}
      </h1>
      <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
        {isZh ? (
          <>
            <p>我们重视您的隐私。本网站使用 minimal 的数据收集方式。</p>
            <p>我们不使用第三方追踪器或广告网络。我们仅收集基本的网站分析数据以改善用户体验。</p>
            <p>我们的联盟链接可能会记录点击次数来追踪佣金，但不会收集个人身份信息。</p>
          </>
        ) : (
          <>
            <p>We value your privacy. This site uses minimal data collection.</p>
            <p>We do not use third-party trackers or ad networks. Basic analytics data may be collected to improve user experience.</p>
            <p>Affiliate links may record clicks for commission tracking but do not collect personally identifiable information.</p>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add about and privacy pages with bilingual content"
```

---

### Phase 4: Features

### Task 4.1: Client-side search with Fuse.js

**Files:**
- Create: `src/components/search-dialog.tsx`
- Modify: `src/components/layout/header.tsx`

- [ ] **Step 1: Create SearchDialog component**

```tsx
// src/components/search-dialog.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Fuse from "fuse.js";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { TutorialPost } from "@/types";

interface Props {
  posts: TutorialPost[];
  lang: string;
}

export default function SearchDialog({ posts, lang }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TutorialPost[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslations("nav");

  const fuse = useRef(
    new Fuse(posts, {
      keys: ["title", "description", "software", "field"],
      threshold: 0.4,
      includeScore: true,
    }),
  );

  useEffect(() => {
    fuse.current = new Fuse(posts, {
      keys: ["title", "description", "software", "field"],
      threshold: 0.4,
      includeScore: true,
    });
  }, [posts]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    const res = fuse.current.search(value);
    setResults(res.slice(0, 8).map((r) => r.item));
  };

  const navigate = (url: string) => {
    setOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-400 hover:border-brand-300 hover:text-gray-600"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">{t("search")}</span>
        <kbd className="hidden rounded border border-gray-200 px-1.5 text-xs text-gray-400 md:inline">
          Ctrl+K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-[15vh]"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b border-gray-200 px-4">
              <Search className="h-5 w-5 shrink-0 text-gray-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t("search")}
                className="w-full bg-transparent px-3 py-3 text-sm outline-none"
              />
              <kbd className="shrink-0 rounded border border-gray-200 px-1.5 text-xs text-gray-400">
                ESC
              </kbd>
            </div>

            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto p-2">
                {results.map((post) => (
                  <button
                    key={post.url}
                    onClick={() => navigate(post.url)}
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-xs text-gray-500">{post.software}</div>
                    </div>
                    <span className="text-xs text-gray-400">{post.level}</span>
                  </button>
                ))}
              </div>
            )}

            {query.length >= 2 && results.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-400">No results found.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Update Header to include search**

Edit `src/components/layout/header.tsx` — replace the nav section:

```tsx
// Inside the nav element, after the home link:
import { getAllPosts } from "@/lib/posts";
import SearchDialog from "@/components/search-dialog";
```

Add search dialog to the header nav, after the home link and before the about link.

Edit the header.tsx nav section:
```tsx
<nav className="hidden items-center gap-6 md:flex">
  <Link href={`/${lang}`} className="text-sm font-medium text-gray-600 hover:text-brand-600">
    {t("home")}
  </Link>
  <Link href={`/${lang}/about`} className="text-sm font-medium text-gray-600 hover:text-brand-600">
    {t("about")}
  </Link>
  <SearchDialog posts={getAllPosts(lang)} lang={lang} />
  <LanguageSwitcher lang={lang} />
</nav>
```

Also add the import to the header file:
```tsx
import { getAllPosts } from "@/lib/posts";
import SearchDialog from "@/components/search-dialog";
```

- [ ] **Step 3: Verify build**

```bash
npx next build
```

Expected: Build succeeds, search dialog opens with Ctrl+K and returns results.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Fuse.js search dialog with Ctrl+K"
```

---

### Task 4.2: Email subscription component

**Files:**
- Create: `src/app/api/subscribe/route.ts`
- Create: `src/components/email-subscribe.tsx`

- [ ] **Step 1: Create API route for subscription**

```ts
// src/app/api/subscribe/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // TODO: Integrate with Mailchimp / ConvertKit API
    // const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    // const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
    // await mailchimp.lists.addListMember(MAILCHIMP_LIST_ID, { email_address: email, status: "subscribed" });

    console.log("Subscription request:", email);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create EmailSubscribe component**

```tsx
// src/components/email-subscribe.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function EmailSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = useTranslations("home");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="rounded-lg bg-gradient-to-r from-brand-50 to-blue-50 p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-900">
        {t("heroTitle")}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Get notified when new tutorials are published.
      </p>

      {status === "success" ? (
        <p className="mt-4 text-sm text-green-600">Thanks for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto mt-4 flex max-w-md gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-red-500">Something went wrong. Try again.</p>
      )}
    </section>
  );
}
```

- [ ] **Step 3: Add EmailSubscribe to homepage**

Edit `src/app/[lang]/page.tsx` — add after the "Latest Tutorials" section:

```tsx
import EmailSubscribe from "@/components/email-subscribe";

// Add before the closing </div>
<section className="mt-12">
  <EmailSubscribe />
</section>
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add email subscription with API route"
```

---

### Task 4.3: Giscus comments

**Files:**
- Modify: `src/app/[lang]/[field]/[software]/[slug]/page.tsx` (add after MDX content)
- Create: `src/components/giscus-comments.tsx`

- [ ] **Step 1: Create Giscus comments component**

```tsx
// src/components/giscus-comments.tsx
"use client";

import { useTheme } from "next/navigation";

export default function GiscusComments() {
  // Giscus loads via client-side script injection
  // Replace repo/term with actual values when repo exists
  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div
        className="giscus"
        data-repo="your-username/obsidian"
        data-repo-id="YOUR_REPO_ID"
        data-category="Comments"
        data-category-id="YOUR_CATEGORY_ID"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="light"
        data-lang="zh-CN"
        data-loading="lazy"
      />
      <p className="mt-2 text-xs text-gray-400">
        Comments powered by GitHub Discussions. Set up Giscus in your repo to enable.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Add Giscus script to root layout**

Add to `src/app/layout.tsx` inside the `<body>`:

```tsx
<script
  src="https://giscus.app/client.js"
  data-repo="your-username/obsidian"
  data-repo-id="YOUR_REPO_ID"
  data-category="Comments"
  data-category-id="YOUR_CATEGORY_ID"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="light"
  data-lang="zh-CN"
  data-loading="lazy"
  crossOrigin="anonymous"
  async
/>
```

- [ ] **Step 3: Add comments to article page**

In `src/app/[lang]/[field]/[software]/[slug]/page.tsx`, after the `<MdxLayout>` content, add:

```tsx
import GiscusComments from "@/components/giscus-comments";

// In the component return, before the closing </div> of the page:
<section className="mx-auto max-w-7xl px-4 pb-12">
  <GiscusComments />
</section>
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Giscus comments component"
```

---

### Phase 5: SEO & Polish

### Task 5.1: SEO — sitemap, robots, structured data

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

- [ ] **Step 1: Create dynamic sitemap**

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const zhPosts = getAllPosts("zh");
  const enPosts = getAllPosts("en");
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const lang of ["zh", "en"]) {
    entries.push({
      url: `https://obsidian-tutorials.com/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
    entries.push({
      url: `https://obsidian-tutorials.com/${lang}/about`,
      changeFrequency: "monthly",
      priority: 0.3,
    });
    entries.push({
      url: `https://obsidian-tutorials.com/${lang}/privacy`,
      changeFrequency: "monthly",
      priority: 0.2,
    });
  }

  // Tutorial posts
  for (const post of zhPosts) {
    entries.push({
      url: `https://obsidian-tutorials.com${post.url}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }
  for (const post of enPosts) {
    entries.push({
      url: `https://obsidian-tutorials.com${post.url}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
```

- [ ] **Step 2: Create robots.ts**

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://obsidian-tutorials.com/sitemap.xml",
  };
}
```

- [ ] **Step 3: Add Schema.org structured data to article page**

Edit `src/app/[lang]/[field]/[software]/[slug]/page.tsx` — add JSON-LD:

In the component, after the `generateMetadata` export, add structured data rendering:

```tsx
import Script from "next/script";

// Inside the component return, add before MdxLayout:
<Script
  id="article-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: { "@type": "Person", name: "Obsidian" },
      about: { "@type": "SoftwareApplication", name: post.software },
      inLanguage: lang,
    }),
  }}
/>
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add sitemap, robots, schema.org structured data"
```

---

### Task 5.2: Final verification + cleanup

- [ ] **Step 1: Run full build**

```bash
npx next build
```

Expected: Clean build, no TypeScript errors, no missing exports.

- [ ] **Step 2: Verify file structure matches plan**

Run:

```bash
echo "=== Check core files ==="
ls -la package.json tsconfig.json next.config.ts middleware.ts postcss.config.js
echo "=== Check src structure ==="
find src -name "*.ts" -o -name "*.tsx" -o -name "*.css" | sort
echo "=== Check posts ==="
find posts -name "*.mdx" | sort
echo "=== Check messages ==="
ls messages/
```

Expected: All files present per file structure diagram.

- [ ] **Step 3: Fix any TypeScript errors**

If build errors exist, fix imports, type mismatches, or missing exports.

- [ ] **Step 4: Commit final state**

```bash
git add -A
git commit -m "chore: final cleanup and build verification"
```
