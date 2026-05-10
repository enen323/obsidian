"use client";

import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <main>
      <h1>{t("heroTitle")}</h1>
      <p>{t("heroSubtitle")}</p>
    </main>
  );
}
