/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createHttpClient } from '@/lib/http-client-factory';
import type { Api } from './generated/Api';

// Type for API methods (without the wrapper)
type ApiMethods = Api<any>['api'];

/**
 * Global API instance (singleton)
 * Uses unified Fetch-based API with customFetch for client-side features
 */
let globalApiInstance: ApiMethods | null = null;

/**
 * Get or create global API client instance
 * Uses singleton pattern - only creates once per app lifecycle
 */
function getOrCreateApiInstance(): ApiMethods {
  // Return existing instance if available
  if (globalApiInstance) {
    return globalApiInstance;
  }

  // Create new instance
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Api } = require('./generated/Api');

    // Create client-side HTTP client config
    const config = createHttpClient(false); // false = client-side
    const instance = new Api(config);
    const apiMethods = instance.api;

    // Cache the global instance
    globalApiInstance = apiMethods;

    return apiMethods;
  } catch (error) {
    console.error('Failed to initialize API client. Make sure to run: pnpm api:generate');
    console.error(error);
    throw new Error('API client not initialized. Run: pnpm api:generate');
  }
}

/**
 * Hook to get API client instance for client components
 * Automatically includes the current locale in all requests via x-locale header
 *
 * Locale is automatically parsed from URL pathname (e.g., /en/... or /zh/...)
 *
 * Uses singleton pattern: all components share the same API instance globally
 * Uses Fetch with customFetch for client-side features
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useApiClient } from '@/api/client-api';
 *
 * export function MyComponent() {
 *   const api = useApiClient();
 *
 *   const fetchData = async () => {
 *     const response = await api.getUserInfo({});
 *     return response.data;
 *   };
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useApiClient(): ApiMethods {
  // No need for useMemo - globalApiInstance already provides singleton behavior
  // getOrCreateApiInstance() is very lightweight (just an if check and return)
  return getOrCreateApiInstance();
}

/**
 * Create API client instance directly (non-hook version)
 * Useful when you need to make requests outside of React components
 *
 * Locale is automatically parsed from URL pathname
 *
 * Also uses singleton pattern - returns the same global instance
 *
 * @example
 * ```typescript
 * import { createClientApi } from '@/api/client-api';
 *
 * // In utility functions or event handlers
 * export async function fetchData() {
 *   const api = createClientApi();
 *   const response = await api.getUserInfo({});
 *   return response.data;
 * }
 * ```
 */
export function createClientApi(): ApiMethods {
  return getOrCreateApiInstance();
}

/**
 * Clear API instance cache
 * Useful for testing or when you need to force recreation
 * (e.g., after locale changes in SPA navigation)
 */
export function clearApiCache() {
  globalApiInstance = null;
}

export const clientApi = createClientApi();
