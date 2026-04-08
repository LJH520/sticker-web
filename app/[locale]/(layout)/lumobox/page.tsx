import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { getMetadata, Locale } from '@/i18n/config';
import { RouteEnum } from '@/constants/route';
import { PageHeader } from '@/components/layout/page-header';
import { serverApi } from '@/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'app.debates',
  });
  return getMetadata({
    locale,
    pathname: RouteEnum.lumobox,
    title: t('metadata.title'),
    description: t('metadata.description'),
  });
}

const PAGE_SIZE = 18;

async function DebateCompetitionListLoader() {
  const res = await serverApi
    .pageDebateCompetitionList({
      current: 1,
      size: PAGE_SIZE,
    })
    .catch(() => undefined);
  const initialData = res?.data?.data?.records ?? [];
  const total = res?.data?.data?.total ?? 0;

  return (
    <div>
      {initialData.map((item) => (
        <div key={item.bindAvatarId}>{item.proponentView}</div>
      ))}
      <div>Total: {total}</div>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'app.debates',
  });
  return (
    <section className="flex h-full flex-col bg-[#EDF4F8] p-10">
      <h1 className="hidden">{t('name')}</h1>
      <PageHeader title={t('name')} color="#9EC7F8" />
      {/* <div className="-m-10 scrollbar-hidden flex flex-1 flex-col overflow-y-auto p-10">
        <Suspense fallback={<DebateCompetitionListSkeleton />}>
          <DebateCompetitionListLoader />
        </Suspense>
      </div> */}
    </section>
  );
}
