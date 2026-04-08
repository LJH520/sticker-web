import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Axios到Fetch Response的适配器
 * 将Axios响应转换为Fetch API兼容的Response对象
 */
export class AxiosFetchAdapter {
  private axiosInstance: AxiosInstance;

  /**
   * 构造函数支持两种方式：
   * 1. 传入 AxiosInstance（推荐）- 使用已配置好的实例
   * 2. 传入 AxiosRequestConfig - 创建新实例
   */
  constructor(configOrInstance: AxiosRequestConfig | AxiosInstance) {
    if ('request' in configOrInstance) {
      // 如果是 AxiosInstance
      this.axiosInstance = configOrInstance;
    } else {
      // 如果是 AxiosRequestConfig
      this.axiosInstance = axios.create(configOrInstance);
    }
  }

  /**
   * 将Axios响应转换为Fetch Response
   */
  private axiosToFetchResponse(axiosResponse: AxiosResponse): Response {
    const headers = new Headers();

    // 转换headers
    Object.entries(axiosResponse.headers).forEach(([key, value]) => {
      if (value !== undefined) {
        headers.set(key, String(value));
      }
    });

    // 创建Response对象
    return new Response(JSON.stringify(axiosResponse.data), {
      status: axiosResponse.status,
      statusText: axiosResponse.statusText,
      headers,
    });
  }

  /**
   * 创建兼容Fetch API的请求函数
   */
  public createFetchCompatible(): typeof fetch {
    return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      try {
        const url = typeof input === 'string' ? input : input.toString();

        // 将RequestInit转换为AxiosRequestConfig
        const axiosConfig: AxiosRequestConfig = {
          url,
          method: init?.method || 'GET',
          headers: init?.headers as Record<string, string>,
          data: init?.body,
          // 传递自定义参数
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(init as any),
        };

        // 发送Axios请求
        const axiosResponse = await this.axiosInstance.request(axiosConfig);

        // 转换为Fetch Response
        return this.axiosToFetchResponse(axiosResponse);
      } catch (error) {
        // Axios错误已经在拦截器中处理
        // 这里直接抛出，让外层处理
        throw error;
      }
    };
  }

  /**
   * 获取Axios实例（用于配置拦截器）
   */
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
