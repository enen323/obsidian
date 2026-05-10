"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";
import SearchDialog from "@/components/search-dialog";

interface SearchPost {
  title: string;
  description: string;
  url: string;
  field: string;
  software: string;
  level: string;
}

export default function Header({ lang, allPosts }: { lang: string; allPosts?: SearchPost[] }) {
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
          {allPosts && <SearchDialog posts={allPosts} searchPlaceholder={t("search")} />}
          <LanguageSwitcher lang={lang} />
        </nav>
      </div>
    </header>
  );
}
