"use client";

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
