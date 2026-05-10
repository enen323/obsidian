import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { locales } from "../../../i18n/request";
import zhMessages from "../../../messages/zh.json";
import enMessages from "../../../messages/en.json";
import { I18nProvider } from "./i18n-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getAllPosts } from "@/lib/posts";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const messagesMap = {
  zh: zhMessages,
  en: enMessages,
} as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = messagesMap[locale as keyof typeof messagesMap];

  const allPosts = getAllPosts(locale).map((p) => ({
    title: p.title,
    description: p.description,
    url: p.url,
    field: p.field,
    software: p.software,
    level: p.level,
  }));

  return (
    <html lang={locale}>
      <body>
        <I18nProvider locale={locale} messages={messages}>
          <div className="flex min-h-screen flex-col">
            <Header lang={locale} allPosts={allPosts} />
            <main className="flex-1">{children}</main>
            <Footer lang={locale} />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
