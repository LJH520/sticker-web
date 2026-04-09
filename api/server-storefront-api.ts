import { cache } from 'react';
import { DEFAULT_STOREFRONT_API_VERSION } from './storefront-api';

type StorefrontVariables = Record<string, unknown>;

export type StorefrontGraphQLError = {
  message: string;
  path?: Array<string | number>;
  extensions?: unknown;
};

export type StorefrontError = {
  message: string;
  networkStatusCode?: number;
  graphQLErrors?: StorefrontGraphQLError[];
  response?: Response;
};

export type StorefrontRequestOptions<
  TVariables extends StorefrontVariables = StorefrontVariables,
> = Omit<RequestInit, 'body' | 'headers'> & {
  variables?: TVariables;
  headers?: HeadersInit;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export type StorefrontResponse<TData = unknown> = {
  data?: TData;
  extensions?: unknown;
  headers: Headers;
  errors?: StorefrontError;
};

export type ServerStorefrontApi = {
  request<TData = unknown, TVariables extends StorefrontVariables = StorefrontVariables>(
    operation: string,
    options?: StorefrontRequestOptions<TVariables>,
  ): Promise<StorefrontResponse<TData>>;
};

type ServerStorefrontConfig = {
  apiUrl: string;
  headers: HeadersInit;
};

function getRequiredServerEnv(name: string, fallbackName?: string): string {
  const value = process.env[name] || (fallbackName ? process.env[fallbackName] : undefined);

  if (!value) {
    throw new Error(`Missing ${name}${fallbackName ? ` or ${fallbackName}` : ''}.`);
  }

  return value;
}

function normalizeStoreDomain(storeDomain: string): string {
  if (storeDomain.startsWith('http://') || storeDomain.startsWith('https://')) {
    return storeDomain;
  }

  return `https://${storeDomain}`;
}

const getCachedServerStorefrontConfig = cache((): ServerStorefrontConfig => {
  const storeDomain = getRequiredServerEnv(
    'SHOPIFY_STORE_DOMAIN',
    'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN',
  );
  const apiVersion =
    process.env.SHOPIFY_STOREFRONT_API_VERSION ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION ||
    DEFAULT_STOREFRONT_API_VERSION;
  const privateAccessToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  const publicAccessToken =
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN;

  if (!privateAccessToken && !publicAccessToken) {
    throw new Error(
      'Missing Shopify storefront token. Set SHOPIFY_STOREFRONT_ACCESS_TOKEN or SHOPIFY_STOREFRONT_PRIVATE_TOKEN.',
    );
  }

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (privateAccessToken) {
    baseHeaders['Shopify-Storefront-Private-Token'] = privateAccessToken;
  } else if (publicAccessToken) {
    baseHeaders['X-Shopify-Storefront-Access-Token'] = publicAccessToken;
  }

  return {
    apiUrl: `${normalizeStoreDomain(storeDomain)}/api/${apiVersion.trim()}/graphql.json`,
    headers: baseHeaders,
  };
});

function buildStorefrontError(
  response: Response,
  payload?: { errors?: StorefrontGraphQLError[]; data?: unknown },
): StorefrontError {
  const graphQLErrors = payload?.errors;
  const hasGraphQLErrors = Array.isArray(graphQLErrors) && graphQLErrors.length > 0;
  const message =
    graphQLErrors?.map((error) => error.message).join('; ') ||
    `HTTP ${response.status}: ${response.statusText}`;

  return {
    message,
    networkStatusCode: response.status,
    graphQLErrors: hasGraphQLErrors ? graphQLErrors : undefined,
    response,
  };
}

function mergeHeaders(baseHeaders: HeadersInit, requestHeaders?: HeadersInit) {
  const mergedHeaders = new Headers(baseHeaders);

  if (requestHeaders) {
    new Headers(requestHeaders).forEach((value, key) => {
      mergedHeaders.set(key, value);
    });
  }

  return mergedHeaders;
}

export async function createServerStorefrontApi(): Promise<ServerStorefrontApi> {
  return {
    request: serverStorefrontRequest,
  };
}

export async function serverStorefrontRequest<
  TData = unknown,
  TVariables extends StorefrontVariables = StorefrontVariables,
>(
  operation: string,
  options?: StorefrontRequestOptions<TVariables>,
): Promise<StorefrontResponse<TData>> {
  const { apiUrl, headers } = getCachedServerStorefrontConfig();
  const { variables, headers: requestHeaders, ...requestOptions } = options ?? {};

  const requestInit: RequestInit & {
    next?: StorefrontRequestOptions['next'];
  } = {
    method: 'POST',
    ...requestOptions,
    headers: mergeHeaders(headers, requestHeaders),
    body: JSON.stringify({
      query: operation,
      variables,
    }),
  };

  const response = await fetch(apiUrl, requestInit);
  const payload = (await response.json().catch(() => null)) as
    | {
        data?: TData;
        errors?: StorefrontGraphQLError[];
        extensions?: unknown;
      }
    | null;

  return {
    data: payload?.data,
    extensions: payload?.extensions,
    headers: response.headers,
    errors:
      !response.ok || payload?.errors?.length
        ? buildStorefrontError(response, payload ?? undefined)
        : undefined,
  };
}
