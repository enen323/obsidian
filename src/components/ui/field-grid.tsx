"use client";

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
