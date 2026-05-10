import type { AffiliateLink } from "@/types";
import zhMessages from "../../../messages/zh.json";
import enMessages from "../../../messages/en.json";

const messagesMap = { zh: zhMessages, en: enMessages } as const;

export default function AffiliateBanner({
  links,
  lang,
}: {
  links: AffiliateLink[];
  lang: string;
}) {
  if (links.length === 0) return null;

  const t = messagesMap[lang as keyof typeof messagesMap]?.article;

  return (
    <div className="my-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <p className="text-sm text-yellow-800">
        {t?.affiliateDisclaimer || "Some links are affiliate links."}
      </p>
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
    </div>
  );
}
