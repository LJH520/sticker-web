import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { getMetadata, Locale } from '@/i18n/config';
import { RouteEnum } from '@/constants/route';
import { getProducts, safeGetProducts } from '@/api';

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
        <Suspense fallback={<div>Loading products...</div>}>
          <ShopifyProducts />
        </Suspense>
      </div>
    </section>
  );
}

export async function ShopifyProducts() {
  let rData;
  const result = await safeGetProducts({
    first: 2,
    imagesFirst: 1,
    next: {
      revalidate: 300,
      tags: ['shopify-products'],
    },
  });

  if (result.ok) {
    console.log('Shopify products data:', result.data);
    rData = result.data;
  }

  return (
    <ul>
      {rData?.products.nodes.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}
