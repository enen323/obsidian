import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { locales } from "../../../i18n/request";
import zhMessages from "../../../messages/zh.json";
import enMessages from "../../../messages/en.json";
import { I18nProvider } from "./i18n-provider";

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

  return (
    <html lang={locale}>
      <body>
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
