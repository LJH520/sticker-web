/**
 * 扩展Axios请求配置，添加自定义参数
 */
declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * 是否显示toast提示
     * @default true
     */
    showToast?: boolean;

    /**
     * 失败时是否抛出异常
     * @default false (返回错误响应而不抛异常)
     */
    rejectOnError?: boolean;
  }
}

export {};
