import { Layout } from '@/components/layout/layout';
import { Locale } from '@/i18n/config';
import { setRequestLocale } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Layout>{children}</Layout>;
}
