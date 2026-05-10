import { notFound } from "next/navigation";
import { getAllPosts, getPostsBySoftware } from "@/lib/posts";
import TutorialCard from "@/components/ui/tutorial-card";
import { locales } from "../../../../../i18n/request";

export function generateStaticParams() {
  const params: { locale: string; field: string; software: string }[] = [];

  for (const locale of locales) {
    const posts = getAllPosts(locale);
    const seen = new Set<string>();

    for (const post of posts) {
      const key = `${post.field}/${post.software}`;
      if (!seen.has(key)) {
        seen.add(key);
        params.push({ locale, field: post.field, software: post.software });
      }
    }
  }

  return params;
}

export default async function SoftwarePage({
  params,
}: {
  params: Promise<{ locale: string; field: string; software: string }>;
}) {
  const { locale, field, software } = await params;
  const allPosts = getAllPosts(locale);
  const posts = getPostsBySoftware(allPosts, field, software);

  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 capitalize">{software}</h1>
      <p className="mb-8 text-gray-500">{posts.length} tutorials</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <TutorialCard key={post.url} post={post} lang={locale} />
        ))}
      </div>
    </div>
  );
}
