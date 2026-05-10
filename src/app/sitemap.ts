import type { MetadataRoute } from "next";
import { locales } from "../../i18n/request";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

const BASE_URL = "https://obsidian-tutorials.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    // Static pages
    entries.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
    entries.push({
      url: `${BASE_URL}/${lang}/about`,
      changeFrequency: "monthly",
      priority: 0.3,
    });
    entries.push({
      url: `${BASE_URL}/${lang}/privacy`,
      changeFrequency: "monthly",
      priority: 0.2,
    });

    // Tutorial posts
    const posts = getAllPosts(lang);
    for (const post of posts) {
      entries.push({
        url: `${BASE_URL}${post.url}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
