import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { getUserAuthorization } from './auth';
import { SPEAKAMI_APP_ID } from '@/constants';

/**
 * 显示Toast提示
 */
function showToast(message: string, type: 'success' | 'error' = 'error') {
  if (typeof window !== 'undefined') {
    console.log(`[Toast ${type.toUpperCase()}]:`, message);
    toast?.[type]?.(message);
  }
}

/**
 * 创建Axios实例
 */
export function createAxiosInstance(config?: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });

  return instance;
}

/**
 * 添加请求拦截器
 */
export function addRequestInterceptor(instance: AxiosInstance, locale: string) {
  instance.interceptors.request.use(
    (config) => {
      // 1. 添加 locale
      config.headers['x-locale'] = locale;

      // 2. 添加 token
      if (typeof window !== 'undefined') {
        const Authorization = getUserAuthorization();
        if (Authorization) {
          config.headers['Authorization'] = Authorization;
        }
      }

      // 3. 可以添加其他自定义逻辑
      // 例如：添加时间戳、请求ID等
      config.headers['x-app-id'] = SPEAKAMI_APP_ID;

      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    },
  );
}

/**
 * 添加响应拦截器
 */
export function addResponseInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 成功响应处理
      const config = response.config;

      if (config.showToast && typeof window !== 'undefined') {
        const data = response.data as Record<string, unknown>;
        // Customize based on your API response structure
        if (data?.msg && typeof data.msg === 'string' && data?.code !== 0) {
          showToast(data.msg, 'error');
        }
      }

      return response;
    },
    (error: AxiosError) => {
      // 错误响应处理
      const config = error.config;
      const shouldShowToast = config?.showToast !== false;
      const rejectOnError = config?.rejectOnError === true;

      if (error.response) {
        // 服务器返回了错误响应
        const data = error.response.data as Record<string, unknown>;
        const msg = typeof data?.msg === 'string' ? data.msg : undefined;
        const errorMessage = msg || `HTTP ${error.response.status}: ${error.response.statusText}`;

        // 显示 toast
        if (shouldShowToast) {
          showToast(errorMessage, 'error');
        }

        // 根据状态码做特殊处理
        switch (error.response.status) {
          case 401:
            // 未授权，可以跳转到登录页
            if (typeof window !== 'undefined') {
              // window.location.href = '/login';
            }
            break;
          case 403:
            // 无权限
            break;
          case 404:
            // 资源不存在
            break;
          case 500:
            // 服务器错误
            break;
        }

        // 如果不抛异常，返回包装的错误响应
        if (!rejectOnError) {
          return Promise.resolve({
            ...error.response,
            data: {
              code: error.response.status,
              msg: errorMessage,
              data: null,
              currentTime: Date.now(),
            },
          } as AxiosResponse);
        }
      } else if (error.request) {
        // 请求已发送但没有收到响应
        const errorMessage = '网络错误，请检查您的网络连接';
        if (shouldShowToast) {
          showToast(errorMessage, 'error');
        }

        if (!rejectOnError) {
          return Promise.resolve({
            status: 0,
            statusText: 'Network Error',
            data: {
              code: 0,
              msg: errorMessage,
              data: null,
              currentTime: Date.now(),
            },
            headers: {},
            config: error.config!,
          } as AxiosResponse);
        }
      } else {
        // 请求配置错误
        const errorMessage = error.message || '请求配置错误';
        if (shouldShowToast) {
          showToast(errorMessage, 'error');
        }
      }

      return Promise.reject(error);
    },
  );
}

/**
 * 配置完整的Axios实例（包含所有拦截器）
 */
export function setupAxiosInstance(locale: string, config?: AxiosRequestConfig): AxiosInstance {
  const instance = createAxiosInstance(config);
  addRequestInterceptor(instance, locale);
  addResponseInterceptor(instance);
  return instance;
}
