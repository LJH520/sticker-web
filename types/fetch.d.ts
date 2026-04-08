/**
 * Extend RequestInit interface with custom parameters
 */
declare global {
  interface RequestInit {
    /**
     * Whether to show toast notification on error
     * @default true
     */
    showToast?: boolean;

    /**
     * Whether to reject (throw error) on HTTP errors
     * @default false (returns error response instead)
     */
    rejectOnError?: boolean;

    /**
     * Locale for server-side requests (passed internally)
     * @internal
     */
    _locale?: string;
  }
}

export {};
