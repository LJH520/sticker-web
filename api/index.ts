/**
 * Unified API exports
 * Single source of truth for all API imports
 */

// Client API exports
export { useApiClient, createClientApi, clearApiCache, clientApi } from './client-api';

// Server API exports
export { createServerApi, serverApi } from './server-api';

// Convenience aliases
export { useApiClient as useApi } from './client-api';

// Type exports
export type * from './generated/Api';
