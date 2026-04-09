import {
  createStorefrontApiClient as createShopifyStorefrontApiClient,
  type StorefrontApiClient,
} from '@shopify/storefront-api-client';

export const DEFAULT_STOREFRONT_API_VERSION = '2026-04';

type NativeStorefrontApiClientOptions = Parameters<typeof createShopifyStorefrontApiClient>[0];

type StorefrontTokenOptions =
  | {
      publicAccessToken: string;
      privateAccessToken?: never;
    }
  | {
      privateAccessToken: string;
      publicAccessToken?: never;
    };

export type AppStorefrontApiClientOptions = {
  storeDomain: string;
  apiVersion?: string;
  clientName?: string;
  retries?: number;
  customFetchApi?: NativeStorefrontApiClientOptions['customFetchApi'];
  logger?: NativeStorefrontApiClientOptions['logger'];
} & StorefrontTokenOptions;

function normalizeStoreDomain(storeDomain: string): string {
  if (!storeDomain) {
    throw new Error(
      'Missing Shopify store domain. Set SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN.',
    );
  }

  if (storeDomain.startsWith('http://') || storeDomain.startsWith('https://')) {
    return storeDomain;
  }

  return `https://${storeDomain}`;
}

export function createStorefrontApiClient({
  storeDomain,
  apiVersion = DEFAULT_STOREFRONT_API_VERSION,
  ...rest
}: AppStorefrontApiClientOptions): StorefrontApiClient {
  return createShopifyStorefrontApiClient({
    storeDomain: normalizeStoreDomain(storeDomain),
    apiVersion,
    ...rest,
  });
}

export type { NativeStorefrontApiClientOptions, StorefrontApiClient };
