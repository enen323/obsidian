import { getAllPosts, getAllFields, getFeaturedPosts } from "@/lib/posts";
import FieldGrid from "@/components/ui/field-grid";
import TutorialCard from "@/components/ui/tutorial-card";
import EmailSubscribe from "@/components/email-subscribe";
import enMessages from "../../../messages/en.json";
import zhMessages from "../../../messages/zh.json";

const messagesMap = { zh: zhMessages, en: enMessages } as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = getAllPosts(locale);
  const fields = getAllFields(posts);
  const featured = getFeaturedPosts(posts);
  const latest = posts.slice(0, 6);
  const t = messagesMap[locale as keyof typeof messagesMap]?.home;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          {t?.heroTitle}
        </h1>
        <p className="mt-3 text-lg text-gray-500">{t?.heroSubtitle}</p>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t?.recommendedTools}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((post) => (
              <TutorialCard key={post.url} post={post} lang={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Fields */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t?.fields}
        </h2>
        <FieldGrid fields={fields} lang={locale} />
      </section>

      {/* Latest */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t?.latestTutorials}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <TutorialCard key={post.url} post={post} lang={locale} />
          ))}
        </div>
      </section>

      {/* Email Subscribe */}
      <section className="mt-12">
        <EmailSubscribe locale={locale} />
      </section>
    </div>
  );
}
