import { notFound } from "next/navigation";
import { getAllPosts, getPostsByField } from "@/lib/posts";
import TutorialCard from "@/components/ui/tutorial-card";
import zhMessages from "../../../../messages/zh.json";
import enMessages from "../../../../messages/en.json";

const messagesMap = { zh: zhMessages, en: enMessages } as const;
const VALID_FIELDS = ["design", "dev", "office", "productivity", "video", "ai"];

export function generateStaticParams() {
  return VALID_FIELDS.map((field) => ({ field }));
}

export default async function FieldPage({
  params,
}: {
  params: Promise<{ locale: string; field: string }>;
}) {
  const { locale, field } = await params;
  if (!VALID_FIELDS.includes(field)) notFound();

  const allPosts = getAllPosts(locale);
  const posts = getPostsByField(allPosts, field);
  const ft = messagesMap[locale as keyof typeof messagesMap]?.field;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        {ft?.[field as keyof typeof ft] || field}
      </h1>
      <p className="mb-8 text-gray-500">{posts.length} tutorials</p>

      {posts.length === 0 ? (
        <p className="text-gray-400">No tutorials yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <TutorialCard key={post.url} post={post} lang={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
