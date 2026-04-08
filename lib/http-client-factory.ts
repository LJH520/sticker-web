import { AxiosFetchAdapter } from './axios-fetch-adapter';
import { setupAxiosInstance } from './axios';
import { getClientLocale } from '@/i18n/utils';
import { toast } from 'sonner';
import { SPEAKAMI_APP_ID } from '@/constants';

export interface HttpClientConfig {
  baseUrl: string;
  customFetch: typeof fetch;
  baseApiParams?: RequestInit;
}

function showToast(message: string, type: 'success' | 'error' = 'error') {
  if (typeof window !== 'undefined') {
    console.log(`[Toast ${type.toUpperCase()}]:`, message);
    toast?.[type]?.(message);
  }
}

/**
 * 创建客户端HTTP配置（使用Axios适配器）
 */
function createClientHttpClient(): HttpClientConfig {
  const locale = getClientLocale();

  // 使用独立的 axios.ts 配置创建实例（包含所有拦截器）
  const axiosInstance = setupAxiosInstance(locale, {
    // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 创建适配器并传入配置好的 Axios 实例
  const adapter = new AxiosFetchAdapter(axiosInstance);

  // 返回Fetch兼容的配置
  return {
    baseUrl: '',
    customFetch: adapter.createFetchCompatible(),
    baseApiParams: {
      credentials: 'same-origin',
      redirect: 'follow',
    },
  };
}

/**
 * 创建服务端HTTP配置（使用原生Fetch）
 */
function createServerHttpClient(): HttpClientConfig {
  const customFetch = async (...args: Parameters<typeof fetch>): Promise<Response> => {
    const [url, init] = args;

    // 获取locale（服务端从参数传入）
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const locale = (init as any)?._locale || 'en';

    console.log(' SSSSSSSSS args:', args);

    // 构建headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-locale': locale,
      'x-app-id': SPEAKAMI_APP_ID || '',
      ...(init?.headers as Record<string, string>),
    };
    try {
      // 这里可以自定义请求拦截器

      // 发送请求
      const response = await fetch(url, {
        ...init,
        headers,
      });

      // 这里可以自定义响应拦截器

      // 错误处理
      const showToastOption = init?.showToast !== false;
      const rejectOnError = init?.rejectOnError === true;

      if (!response.ok) {
        const data = await response
          ?.clone()
          ?.json()
          .catch(() => ({ msg: '服务器错误' }));
        const errorMessage = data.msg || `HTTP ${response.status}: ${response.statusText}`;

        if (showToastOption) {
          showToast(errorMessage, 'error');
        }

        if (rejectOnError) {
          throw new Error(errorMessage);
        }

        // 返回包装的错误响应
        // 注意：使用 200 状态码避免在 Server Component 中抛出异常
        // 实际的错误信息在 response body 的 code 字段中
        return new Response(
          JSON.stringify({
            code: response.status,
            msg: errorMessage,
            data: null,
            currentTime: Date.now(),
          }),
          {
            status: 200, // 使用 200 避免生成的 API 代码抛出异常
            statusText: 'OK',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
          },
        );
      }

      return response;
    } catch (error) {
      console.error('Fetch error:', error);

      // 判断错误类型
      const errorMessage = error instanceof Error ? error.message : '网络错误';
      const isConnectionError =
        errorMessage.includes('fetch failed') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('ENOTFOUND') ||
        errorMessage.includes('ETIMEDOUT');

      const friendlyMessage = isConnectionError
        ? '无法连接到服务器，请检查网络或服务器是否正常'
        : errorMessage;

      // 显示错误提示
      const showToastOption = init?.showToast !== false;
      if (showToastOption) {
        showToast(friendlyMessage, 'error');
      }

      // 返回包装的错误响应
      // 注意：使用 200 状态码避免在 Server Component 中抛出异常
      // 实际的错误信息在 response body 的 code 字段中
      return new Response(
        JSON.stringify({
          code: -1,
          msg: friendlyMessage,
          data: null,
          currentTime: Date.now(),
        }),
        {
          status: 200, // 使用 200 避免生成的 API 代码抛出异常
          statusText: 'OK',
          headers: new Headers({
            'Content-Type': 'application/json',
            'x-locale': locale,
          }),
        },
      );
    }
  };

  return {
    baseUrl: process.env.API_URL || '',
    customFetch,
    baseApiParams: {
      credentials: 'same-origin',
      redirect: 'follow',
    },
  };
}

/**
 * 创建HTTP客户端配置
 *
 * @param isServer - 是否是服务端环境
 * @returns HttpClientConfig
 *
 * - 客户端：使用Axios（通过适配器转换为Fetch Response）
 * - 服务端：使用原生Fetch
 */
export function createHttpClient(isServer: boolean = false): HttpClientConfig {
  return isServer ? createServerHttpClient() : createClientHttpClient();
}
