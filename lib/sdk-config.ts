import { SDKConfig } from '@unipus/speakami-web-sdk';
import { onClientError, onClientResponse, onServerError, onServerResponse } from './response';
import { getUserAuthorization } from './auth';
import { APP_ENV, SPEAKAMI_APP_ID } from '@/constants';
import { createClientApi } from '@/api';

export const getEnv = () => {
  switch (APP_ENV) {
    case 'production':
      return 'production';
    case 'test':
      return 'test';
    case 'local':
    case 'dev':
    case 'development':
      return 'dev';
    default:
      return 'production';
  }
};

/**
 * SDK 通用配置
 * 服务端和客户端共享的基础配置
 */
export const getSDKConfig = (locale: string): SDKConfig => ({
  lang: locale,
  appId: SPEAKAMI_APP_ID,
  env: getEnv(),
  token: getUserAuthorization(),
  // 客户端配置
  onClientError,
  onClientResponse,
  // 服务端配置（如果需要的话）
  onServerError,
  onServerResponse,
  onRefreshToken: async () => {
    // 调用你的刷新 token 接口
    const api = createClientApi();
    const res = await api.refreshToken();
    const accessToken = res?.data?.data?.accessToken || '';
    // 返回新的 access token
    return accessToken;
  },
});

/**
 * 获取客户端配置
 */
export const getClientConfig = (locale: string): SDKConfig => ({
  ...getSDKConfig(locale),
  // 可以添加仅客户端需要的配置
});

/**
 * 获取服务端配置
 */
export const getServerConfig = (locale: string): SDKConfig => ({
  ...getSDKConfig(locale),
  // 可以添加仅服务端需要的配置
});
