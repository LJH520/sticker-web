import { defaultLocale, Locale, locales } from './config';

/** 改变客户端系统语言 */
export function changeClientLocale(lang: Locale) {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const [, locale, ...rest] = pathname.split('/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (locales.includes(locale as any)) {
      window.location.replace(
        `${lang === defaultLocale ? '' : '/' + lang}/${rest.join('/')}` + window.location.search,
      );
    } else {
      window.location.replace(
        `${lang === defaultLocale ? '' : '/' + lang}/${locale}/${rest.join('/')}` +
          window.location.search,
      );
    }
  }
}

/** 获取客户端系统语言 */
export function getClientLocale(): string {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const [, locale] = pathname.split('/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (locales.includes(locale as any)) {
      return locale;
    }
  }
  return defaultLocale;
}

/** 获取本地化后的网址 */
export function getLocationByLocalized(params: { pathname: string }) {
  const [, pathKey, ...rest] = params?.pathname?.split('/');
  /** 本地化前的路径 */
  let path = '';
  /** 本地化后的路径名 */
  let pathname = '';

  /** 环境 */
  let locale = defaultLocale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (locales.includes(pathKey as any)) {
    path = `/${rest.join('/')}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    locale = pathKey as any;
  } else {
    path = `/${[pathKey, ...rest].join('/')}`;
  }

  pathname = `/${locale}${path}`;
  return {
    path,
    pathname,
    locale,
  };
}
