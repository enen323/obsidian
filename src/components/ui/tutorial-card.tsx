"use client";

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
