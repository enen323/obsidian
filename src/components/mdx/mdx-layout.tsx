import Toc from "@/components/ui/toc";
import Sidebar from "@/components/layout/sidebar";
import AffiliateDisclaimer from "@/components/affiliate/affiliate-disclaimer";
import { formatDate } from "@/lib/utils";
import type { TutorialPost } from "@/types";
import zhMessages from "../../../messages/zh.json";
import enMessages from "../../../messages/en.json";

const messagesMap = { zh: zhMessages, en: enMessages } as const;

export default function MdxLayout({
  post,
  allPosts,
  lang,
  children,
}: {
  post: TutorialPost;
  allPosts: TutorialPost[];
  lang: string;
  children: React.ReactNode;
}) {
  const t = messagesMap[lang as keyof typeof messagesMap]?.article;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Article header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span>{post.software}</span>
          <span>{post.readTime} min read</span>
          <span>{formatDate(post.date, lang)}</span>
        </div>
      </header>

      {/* Three-column layout */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* TOC - left */}
        <div className="hidden w-56 shrink-0 lg:block">
          <Toc />
        </div>

        {/* Content - center */}
        <article className="prose-custom min-w-0 flex-1">
          {children}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <AffiliateDisclaimer />
          </div>
        </article>

        {/* Sidebar - right */}
        <div className="w-full shrink-0 lg:w-72">
          <Sidebar post={post} allPosts={allPosts} lang={lang} />
        </div>
      </div>
    </div>
  );
}
