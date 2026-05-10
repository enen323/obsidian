import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === "zh" ? "关于" : "About",
    description: locale === "zh" ? "关于 Obsidian 教程平台" : "About Obsidian Tutorials",
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        {isZh ? "关于 Obsidian" : "About Obsidian"}
      </h1>
      <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
        {isZh ? (
          <>
            <p>Obsidian 是一个免费的软件实操教程平台。</p>
            <p>我们提供 Photoshop、VS Code、Figma 等各类软件的实操教程，帮助用户快速掌握软件技能。</p>
            <p>本站部分链接为联盟营销链接。如果您通过我们的链接购买产品，我们可能会获得佣金，但您无需支付额外费用。</p>
          </>
        ) : (
          <>
            <p>Obsidian is a free software tutorial platform.</p>
            <p>We provide practical guides for Photoshop, VS Code, Figma, and more.</p>
            <p>Some links on this site are affiliate links. We may earn a commission at no extra cost to you.</p>
          </>
        )}
      </div>
    </div>
  );
}
