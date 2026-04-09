/**
 * Unified API exports
 * Single source of truth for all API imports
 */

// Client API exports
export { useApiClient, createClientApi, clearApiCache, clientApi } from './client-api';

// Server API exports
export { createServerApi, serverApi } from './server-api';

// Shopify Storefront API exports
export {
  createStorefrontApiClient,
  DEFAULT_STOREFRONT_API_VERSION,
} from './storefront-api';
export {
  useStorefrontApiClient,
  createClientStorefrontApi,
  clearStorefrontApiCache as clearStorefrontApiClientCache,
  clientStorefrontApi,
} from './client-storefront-api';
export { createServerStorefrontApi, serverStorefrontRequest } from './server-storefront-api';
export {
  addCartLines,
  createCart,
  getCart,
  getProducts,
  requestStorefrontGraphQL,
  safeAddCartLines,
  safeCreateCart,
  safeGetCart,
  safeGetProducts,
  safeRequestStorefrontGraphQL,
  storefrontGraphQLApi,
} from './graphql-api';

// Convenience aliases
export { useApiClient as useApi } from './client-api';
export { useStorefrontApiClient as useStorefrontApi } from './client-storefront-api';

// Type exports
export type * from './generated/Api';
export type {
  AppStorefrontApiClientOptions,
  NativeStorefrontApiClientOptions,
  StorefrontApiClient,
} from './storefront-api';
export type {
  ProductsQueryData,
  StorefrontAttribute,
  StorefrontAttributeInput,
  StorefrontCart,
  StorefrontCartBuyerIdentityInput,
  StorefrontCartInput,
  StorefrontCartLine,
  StorefrontCartLineInput,
  StorefrontGraphQLOptions,
  StorefrontFailureResult,
  StorefrontImage,
  StorefrontProduct,
  StorefrontProductVariant,
  StorefrontResult,
  StorefrontSelectedOption,
  StorefrontSuccessResult,
  StorefrontUserError,
} from './graphql-api';
export type {
  StorefrontError,
  StorefrontGraphQLError,
  StorefrontRequestOptions,
  StorefrontResponse,
} from './server-storefront-api';
