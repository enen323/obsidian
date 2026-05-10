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

export function getPostsBySoftware(
  posts: TutorialPost[],
  field: string,
  software: string
): TutorialPost[] {
  return posts.filter((p) => p.field === field && p.software === software);
}

export function getFeaturedPosts(posts: TutorialPost[]): TutorialPost[] {
  return posts.filter((p) => p.featured);
}

export function getPostBySlug(
  posts: TutorialPost[],
  slug: string
): TutorialPost | undefined {
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

export function getRelatedPosts(
  posts: TutorialPost[],
  current: TutorialPost,
  limit = 4
): TutorialPost[] {
  return posts
    .filter(
      (p) =>
        p.slug !== current.slug &&
        (p.field === current.field || p.software === current.software)
    )
    .slice(0, limit);
}

export function getAffiliateLinks(meta: TutorialMeta): AffiliateLink[] {
  return meta.affiliateLinks || [];
}

export function getAllSlugs(lang: string): {
  field: string;
  software: string;
  slug: string;
}[] {
  const posts = getAllPosts(lang);
  return posts.map((p) => ({
    field: p.field,
    software: p.software,
    slug: p.slug,
  }));
}
