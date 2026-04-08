'use client';

import { updateConfig } from '@unipus/speakami-web-sdk';
import { getClientConfig } from '@/lib/sdk-config';
import { useEffect, createContext, useContext } from 'react';
import { useLocale } from 'next-intl';

interface SDKContextType {
  locale: string;
}

const SDKContext = createContext<SDKContextType | undefined>(undefined);

export function SDKProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  // 当 locale prop 变化时，自动更新 SDK 配置
  useEffect(() => {
    const config = getClientConfig(locale);
    updateConfig(config);
    console.log('SDK config updated with locale:', config);
  }, [locale]);

  return (
    <SDKContext.Provider value={{ locale }}>
      {children}
    </SDKContext.Provider>
  );
}

/**
 * 使用 SDK 配置的 Hook
 * @example
 * ```tsx
 * const { locale } = useSDK();
 * console.log('Current locale:', locale);
 * ```
 */
export function useSDK() {
  const context = useContext(SDKContext);
  if (context === undefined) {
    throw new Error('useSDK must be used within SDKProvider');
  }
  return context;
}
