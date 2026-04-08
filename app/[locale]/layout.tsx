import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { getLangDir } from 'rtl-detect';
import '@/styles/globals.css';
import { Toaster } from '@/components/ui/sonner';
import { SDKProvider } from '@/components/providers/sdk-provider';
import { init } from '@unipus/speakami-web-sdk';
import { getServerConfig } from '@/lib/sdk-config';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Enable static rendering
  setRequestLocale(locale);

  // 初始化服务端 SDK 配置
  init(getServerConfig(locale));

  const direction = getLangDir(locale);
  const messages = await getMessages({
    locale
  });

  return (
    <html lang={locale} dir={direction}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SDKProvider>{children}</SDKProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
