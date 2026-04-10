import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { getMetadata, Locale } from '@/i18n/config';
import { RouteEnum } from '@/constants/route';
import { PageHeader } from '@/components/layout/page-header';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'app.roleplayScenarios',
  });
  return getMetadata({
    locale,
    pathname: RouteEnum.aboutUs,
    title: t('metadata.title'),
    description: t('metadata.description'),
  });
}

const PAGE_SIZE = 24;

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'app.roleplayScenarios',
  });
  return (
    <div className="flex h-full flex-col bg-[#EDF4F8] p-10">
      <h1 className="hidden">{'常见问题'}</h1>
      <PageHeader title={t('name')} color="#8DEDDF" />
    </div>
  );
}
