import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === "zh" ? "隐私政策" : "Privacy Policy",
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        {isZh ? "隐私政策" : "Privacy Policy"}
      </h1>
      <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
        {isZh ? (
          <>
            <p>我们重视您的隐私。本网站使用 minimal 的数据收集方式。</p>
            <p>我们不使用第三方追踪器或广告网络。我们仅收集基本的网站分析数据以改善用户体验。</p>
            <p>我们的联盟链接可能会记录点击次数来追踪佣金，但不会收集个人身份信息。</p>
          </>
        ) : (
          <>
            <p>We value your privacy. This site uses minimal data collection.</p>
            <p>We do not use third-party trackers or ad networks. Basic analytics data may be collected to improve user experience.</p>
            <p>Affiliate links may record clicks for commission tracking but do not collect personally identifiable information.</p>
          </>
        )}
      </div>
    </div>
  );
}
