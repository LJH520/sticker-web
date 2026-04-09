'use client';

import type { StorefrontApiClient } from '@shopify/storefront-api-client';
import { createStorefrontApiClient, DEFAULT_STOREFRONT_API_VERSION } from './storefront-api';

let globalStorefrontApiInstance: StorefrontApiClient | null = null;

function getClientStorefrontConfig() {
  const storeDomain =
    process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const publicAccessToken =
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN;

  if (!storeDomain) {
    throw new Error('Missing SHOPIFY_STORE_DOMAIN.');
  }

  if (!publicAccessToken) {
    throw new Error('Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN.');
  }

  return {
    storeDomain,
    publicAccessToken,
    apiVersion:
      process.env.SHOPIFY_STOREFRONT_API_VERSION ||
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION ||
      DEFAULT_STOREFRONT_API_VERSION,
  };
}

function getOrCreateStorefrontApiInstance(): StorefrontApiClient {
  if (globalStorefrontApiInstance) {
    return globalStorefrontApiInstance;
  }

  const { storeDomain, publicAccessToken, apiVersion } = getClientStorefrontConfig();

  globalStorefrontApiInstance = createStorefrontApiClient({
    storeDomain,
    apiVersion,
    publicAccessToken,
    clientName: 'sticker-web-client',
  });

  return globalStorefrontApiInstance;
}

export function useStorefrontApiClient(): StorefrontApiClient {
  return getOrCreateStorefrontApiInstance();
}

export function createClientStorefrontApi(): StorefrontApiClient {
  return getOrCreateStorefrontApiInstance();
}

export function clearStorefrontApiCache() {
  globalStorefrontApiInstance = null;
}

export const clientStorefrontApi = new Proxy({} as StorefrontApiClient, {
  get(_, prop: keyof StorefrontApiClient) {
    const api = createClientStorefrontApi();
    const value = api[prop];

    return typeof value === 'function' ? value.bind(api) : value;
  },
});
