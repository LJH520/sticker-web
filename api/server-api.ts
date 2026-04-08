/* eslint-disable @typescript-eslint/no-explicit-any */
import { getLocale } from 'next-intl/server';
import { cache } from 'react';
import { createHttpClient } from '@/lib/http-client-factory';
import type { Api } from './generated/Api';

// Type for API methods (without the wrapper)
type ApiMethods = Api<any>['api'];

/**
 * Get cached API instance for server-side rendering
 * Uses React.cache() for request-level deduplication
 *
 * The cache is automatically cleared after each request
 * Wraps methods to pass locale via _locale parameter
 */
const getCachedApiInstance = cache((locale: string): ApiMethods => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Api } = require('./generated/Api');

    // Create server-side HTTP client config
    const config = createHttpClient(true); // true = server-side
    const instance = new Api(config);
    const originalApi = instance.api;

    // Wrap all methods to inject locale into RequestInit
    const wrappedApi = Object.keys(originalApi).reduce((acc, key) => {
      const originalMethod = originalApi[key];
      if (typeof originalMethod === 'function') {
        acc[key] = (params?: any, requestInit?: RequestInit) => {
          return originalMethod(params, {
            ...requestInit,
            _locale: locale, // Pass locale to customFetch
          });
        };
      } else {
        acc[key] = originalMethod;
      }
      return acc;
    }, {} as any);

    return wrappedApi;
  } catch (error) {
    console.error('Failed to initialize server API client. Make sure to run: pnpm api:generate');
    console.error(error);
    throw new Error('API client not initialized. Run: pnpm api:generate');
  }
});

/**
 * Create API client instance for server components
 * Automatically includes the current locale in all requests via x-locale header
 *
 * Uses React.cache() for request-level deduplication
 * Uses native Fetch for optimal Next.js integration
 *
 * @example Server Component
 * ```typescript
 * import { createServerApi } from '@/api/server-api';
 *
 * export default async function Page() {
 *   const api = await createServerApi();
 *   const res = await api.getUserInfo(
 *     { id: '123' },
 *     {
 *       cache: 'force-cache',
 *       next: { revalidate: 60 }
 *     }
 *   );
 *
 *   return <div>{res.data.data?.name}</div>;
 * }
 * ```
 *
 * @example Server Action
 * ```typescript
 * 'use server';
 * import { createServerApi } from '@/api/server-api';
 *
 * export async function updateUser(formData: FormData) {
 *   const api = await createServerApi();
 *   const res = await api.updateUser({
 *     name: formData.get('name')
 *   });
 *
 *   return res.data;
 * }
 * ```
 */
export async function createServerApi(): Promise<ApiMethods> {
  const locale = await getLocale();
  return getCachedApiInstance(locale);
}

export const serverApi = new Proxy({} as ApiMethods, {
  get(_, prop: string) {
    // 拦截属性访问
    return async (...args: unknown[]) => {
      // 获取 API 实例（通过 React.cache() 缓存）
      const api = await createServerApi();
      const method = api[prop as keyof ApiMethods];

      if (typeof method !== 'function') {
        throw new Error(`Method ${prop} does not exist on ApiMethods`);
      }

      // 执行真正的 API 调用
      return (method as any).apply(api, args);
    };
  },
});
