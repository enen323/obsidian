import type { AffiliateLink } from "@/types";

export default function ToolRecommendation({ link }: { link: AffiliateLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="sponsored nofollow"
      className="block rounded-lg border border-gray-200 p-3 transition hover:border-brand-300 hover:shadow-sm"
    >
      <div className="font-medium text-sm text-gray-900">{link.name}</div>
      <div className="mt-0.5 text-xs text-gray-500">{link.description}</div>
      <div className="mt-1 text-xs text-brand-600">{link.vendor} →</div>
    </a>
  );
}
