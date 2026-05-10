"use client";

import { useRouter, usePathname } from "next/navigation";
import { locales } from "../../../i18n/request";

export default function LanguageSwitcher({ lang }: { lang: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = lang === "zh" ? "en" : "zh";
  const label = lang === "zh" ? "English" : "中文";

  function handleSwitch() {
    const newPath = pathname.replace(`/${lang}`, `/${switchTo}`);
    router.push(newPath);
  }

  return (
    <button
      onClick={handleSwitch}
      className="text-sm font-medium text-gray-600 hover:text-brand-600"
    >
      {label}
    </button>
  );
}
