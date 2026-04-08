import { RouteEnum } from '@/constants/route';
import { getMetadata, Locale } from '@/i18n/config';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getMetadata({
    locale,
    pathname: RouteEnum.health,
    title: 'Health Check',
    description: 'Health Check',
    robots: {
      index: false,
      follow: false,
    },
  });
}

/** 健康检查页面 */
export default function Page() {
  return <div>OK </div>;
}
