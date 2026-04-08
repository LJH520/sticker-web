import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { hasLocale } from 'next-intl';

/**
 * 从远程 CDN 获取 i18n 文件
 */
async function fetchRemoteMessages(locale: string) {
  // 本地开发环境跳过远程获取
  if (process.env.APP_ENV === 'local') {
    return null;
  }

  const CDN_BASE_URL = process.env.NEXT_PUBLIC_I18N_CDN_URL;

  if (!CDN_BASE_URL) {
    return null;
  }

  try {
    const [components, common, app] = await Promise.all([
      fetch(`${CDN_BASE_URL}/${locale}/components.json`, {
        // cache: 'no-cache', // 或根据需要设置缓存策略
        next: { revalidate: 3600 }, // 缓存 1 小时
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
      fetch(`${CDN_BASE_URL}/${locale}/common.json`, {
        // cache: 'no-cache',
        next: { revalidate: 3600 }, // 缓存 1 小时
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
      fetch(`${CDN_BASE_URL}/${locale}/app.json`, {
        // cache: 'no-cache',
        next: { revalidate: 3600 }, // 缓存 1 小时
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    ]);

    console.log(`[i18n] Loaded ${locale} from CDN`);
    return { components, common, app };
  } catch (error) {
    console.warn(`[i18n] Failed to load ${locale} from CDN:`, error);
    return null;
  }
}

/**
 * 从本地加载 i18n 文件
 */
async function loadLocalMessages(locale: string) {
  try {
    const messages = {
      components: (await import(`../messages/${locale}/components.json`)).default,
      common: (await import(`../messages/${locale}/common.json`)).default,
      app: (await import(`../messages/${locale}/app.json`)).default,
    };
    console.log(`[i18n] Loaded ${locale} from local`);
    return messages;
  } catch (error) {
    console.warn(`[i18n] Failed to load ${locale} from local:`, error);
    return null;
  }
}

/**
 * 获取 i18n 消息，优先级：远程 CDN → 本地指定语言 → 本地 en 兜底
 */
export async function getMessages(locale: string) {
  // 1. 优先尝试从远程 CDN 获取
  const remoteMessages = await fetchRemoteMessages(locale);
  if (remoteMessages) {
    return remoteMessages;
  }

  // 2. 尝试从本地加载指定语言
  const localMessages = await loadLocalMessages(locale);
  if (localMessages) {
    return localMessages;
  }

  // 3. 兜底：使用本地 en
  if (locale !== 'en') {
    console.warn(`[i18n] Falling back to 'en' for locale '${locale}'`);
    const fallbackMessages = await loadLocalMessages('en');
    if (fallbackMessages) {
      return fallbackMessages;
    }
  }

  // 4. 最后的兜底：返回空对象（避免应用崩溃）
  console.error(`[i18n] All attempts failed for locale '${locale}'`);
  return {
    components: {},
    common: {},
    app: {},
  };
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  // Load all namespace files
  const messages = await getMessages(locale);

  return {
    locale,
    messages,
  };
});
