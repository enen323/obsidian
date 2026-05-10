"use client";
import { useTranslations } from "next-intl";

export default function AffiliateDisclaimer() {
  const t = useTranslations("article");
  return (
    <p className="text-xs text-gray-400 italic">
      {t("affiliateDisclaimer")}
    </p>
  );
}
