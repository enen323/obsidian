import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { mdxComponents } from "@/components/mdx/components";
import MdxLayout from "@/components/mdx/mdx-layout";
import GiscusComments from "@/components/giscus-comments";
import Script from "next/script";

// export function generateStaticParams() {
//   const slugs: {
//     locale: string;
//     field: string;
//     software: string;
//     slug: string;
//   }[] = [];

//   for (const lang of locales) {
//     const posts = getAllPosts(lang);
//     for (const p of posts) {
//       slugs.push({
//         locale: lang,
//         field: p.field,
//         software: p.software,
//         slug: p.slug,
//       });
//     }
//   }

//   return slugs;
// }

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    field: string;
    software: string;
    slug: string;
  }>;
}) {
  const { locale, slug } = await params;
  const allPosts = getAllPosts(locale);
  const post = getPostBySlug(allPosts, slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/${locale}/${post.field}/${post.software}/${slug}`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{
    locale: string;
    field: string;
    software: string;
    slug: string;
  }>;
}) {
  const { locale, slug } = await params;
  const allPosts = getAllPosts(locale);
  const post = getPostBySlug(allPosts, slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
    components: mdxComponents,
  });

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: { "@type": "Person", name: "Obsidian" },
            about: { "@type": "SoftwareApplication", name: post.software },
            inLanguage: locale,
          }),
        }}
      />
      <MdxLayout post={post} allPosts={allPosts} lang={locale}>
        {content}
      </MdxLayout>
      <GiscusComments lang={locale} />
    </>
  );
}
