import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { getMetadata, Locale } from '@/i18n/config';
import { RouteEnum } from '@/constants/route';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'app.home',
  });
  return getMetadata({
    locale,
    pathname: RouteEnum.home,
    title: t('metadata.title'),
    description: t('metadata.description'),
  });
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'app.home',
  });
  return (
    <section className="flex h-full flex-1 flex-col bg-[#EDF4F8] p-10">
      <h1 className="text-2xl font-bold text-gray-800">{'首页'}</h1>
      <h1 className="text-2xl font-bold text-gray-800">{'首页'}</h1>
      <h1 className="text-2xl font-bold text-gray-800">{'首页'}</h1>
      <h1 className="text-2xl font-bold text-gray-800">{'首页'}</h1>
      <h1 className="text-2xl font-bold text-gray-800">{'首页'}</h1>
      <h1 className="text-2xl font-bold text-gray-800">{'首页'}</h1>
      {/* <PageHeader /> */}
      <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
        {/* <HomeAvatarList>
          <Suspense fallback={<TalkListSkeleton className="mb-8.5" />}>
            <TalkList className="mb-8.5" />
          </Suspense>
        </HomeAvatarList> */}
      </div>
    </section>
  );
}
