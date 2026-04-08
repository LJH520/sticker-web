import { APP_BASE_URL } from '@/constants';
import { RouteEnum } from '@/constants/route';
import { defaultLocale, locales } from '@/i18n/config';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    generateSitemapItem({
      pathname: RouteEnum.home,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    }),
    // 示例：博客详情页的动态站点地图
    // {
    //   url: `${APP_BASE_URL || ''}/sitemap/blog/sitemap.xml`,
    //   lastModified,
    //   changeFrequency: 'daily',
    //   priority: 0.8,
    // },
  ];
}

/** 生成站点地图单项 */
export function generateSitemapItem(
  item: Partial<MetadataRoute.Sitemap[0]> & {
    /** 页面路径名，自动生成国际化后的网址 */
    pathname?: string;
  },
): MetadataRoute.Sitemap[0] {
  if (item?.url) {
    return {
      url: item?.url,
      lastModified: item?.lastModified,
      changeFrequency: item?.changeFrequency,
      priority: item?.priority,
    };
  }

  const pathname = item?.pathname;
  const languages = locales?.reduce(
    (prev, cur) => {
      if (cur === defaultLocale) {
        prev[defaultLocale] = `${APP_BASE_URL}${pathname}`;
        return prev;
      } else {
        prev[cur] = `${APP_BASE_URL}/${cur}${pathname === '/' ? '' : pathname || ''}`;
        return prev;
      }
    },
    {} as Record<string, string>,
  );
  return {
    url: languages[defaultLocale],
    alternates: {
      languages,
    },
    lastModified: item?.lastModified,
    changeFrequency: item?.changeFrequency,
    priority: item?.priority,
  };
}
