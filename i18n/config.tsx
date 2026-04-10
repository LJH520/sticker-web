import { APP_BASE_URL } from '@/constants';
import { Metadata } from 'next';
import ARIcon from './assets/ar-icon.svg';
import ENIcon from './assets/en-icon.svg';
import ESIcon from './assets/es-icon.svg';
import FRIcon from './assets/fr-icon.svg';
import PTIcon from './assets/pt-icon.svg';
import RUIcon from './assets/ru-icon.svg';
import ZHIcon from './assets/zh-icon.svg';

// export type Locale = 'en' | 'zh' | 'ar' | 'es' | 'fr' | 'ru' | 'pt';
export type Locale = 'en';

// export const locales: Locale[] = ['en', 'zh', 'ar', 'es', 'fr', 'ru', 'pt'];
export const locales: Locale[] = ['en'];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  // zh: '中文',
  // ar: 'العربية',
  // es: 'Español',
  // fr: 'Français',
  // ru: 'Русский',
  // pt: 'Português',
};

export const LocaleOptions = [
  { value: 'en', label: 'English', icon: <ENIcon />, description: '英语' },
  { value: 'zh', label: '中文', icon: <ZHIcon />, description: '中文' },
  { value: 'ar', label: 'العربية', icon: <ARIcon />, description: '阿拉伯语' },
  { value: 'es', label: 'Español', icon: <ESIcon />, description: '西班牙语' },
  { value: 'fr', label: 'Français', icon: <FRIcon />, description: '法语' },
  { value: 'pt', label: 'Português', icon: <PTIcon />, description: '葡萄牙语' },
  { value: 'ru', label: 'Русский', icon: <RUIcon />, description: '俄语' },
];

/** 获取元数据 */
export function getMetadata({
  pathname,
  title,
  description,
  keywords,
  locale,
  ...rest
}: {
  /** 页面路径名 */
  pathname?: string;
  /** 页面语言 */
  locale: string;
} & Partial<Metadata>): Metadata {
  const alternates = getAlternates(pathname || '', locale);
  return {
    title,
    description,
    keywords,
    alternates,
    ...rest,
  };
}

/** 获取国际化后的网址规范设置 */
export function getAlternates(pathname: string, locale: string = defaultLocale) {
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
  languages['x-default'] = languages[defaultLocale];

  return {
    canonical: languages[locale],
    languages,
  };
}
