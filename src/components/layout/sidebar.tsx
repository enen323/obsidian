import { getRelatedPosts, getAffiliateLinks } from "@/lib/posts";
import type { TutorialPost } from "@/types";
import Badge from "@/components/ui/badge";
import ToolRecommendation from "@/components/affiliate/tool-recommendation";
import AffiliateDisclaimer from "@/components/affiliate/affiliate-disclaimer";
import zhMessages from "../../../messages/zh.json";
import enMessages from "../../../messages/en.json";

const messagesMap = { zh: zhMessages, en: enMessages } as const;

export default function Sidebar({
  post,
  allPosts,
  lang,
}: {
  post: TutorialPost;
  allPosts: TutorialPost[];
  lang: string;
}) {
  const related = getRelatedPosts(allPosts, post);
  const affiliateLinks = getAffiliateLinks(post);
  const t = messagesMap[lang as keyof typeof messagesMap]?.article;

  return (
    <aside className="space-y-6">
      {/* Level badge */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {t?.level || "Level"}
        </h4>
        <Badge level={post.level} />
      </div>

      {/* Affiliate tools */}
      {affiliateLinks.length > 0 && (
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t?.recommendedTool || "Recommended Tool"}
          </h4>
          <div className="space-y-3">
            {affiliateLinks.map((link, i) => (
              <ToolRecommendation key={i} link={link} />
            ))}
          </div>
          <div className="mt-2">
            <AffiliateDisclaimer />
          </div>
        </div>
      )}

      {/* Related tutorials */}
      {related.length > 0 && (
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t?.relatedTutorials || "Related Tutorials"}
          </h4>
          <div className="space-y-3">
            {related.map((r) => (
              <a
                key={r.url}
                href={`/${lang}/${r.field}/${r.software}/${r.slug}`}
                className="block text-sm text-gray-600 hover:text-brand-600"
              >
                {r.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
