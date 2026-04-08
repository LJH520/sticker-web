import { RouteEnum } from '@/constants/route';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

/** 404页面 */
export default async function NotFound() {
  const t = await getTranslations('app.notFound');

  return (
    <>
      <title>{t('metadata.title')}</title>
      <meta name="description" content={t('metadata.description')} />

      <div>
        <h1 className="text-3xl font-bold">{t('page.title')}</h1>
        <p className="text-lg">{t('page.description')}</p>
        <Link href={RouteEnum.home} className="text-blue-500">
          {t('page.backToHome')}
        </Link>
      </div>
    </>
  );
}
