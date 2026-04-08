import { useEffect, useMemo, useRef } from 'react';
import { debounce, type DebounceSettings } from 'lodash-es';

/**
 * 自定义 Hook：创建一个 debounced 函数
 *
 * @param callback - 要防抖的回调函数
 * @param delay - 防抖延迟（毫秒）
 * @param options - lodash debounce 选项
 *
 * @example
 * ```tsx
 * const handleSearch = useDebounce(
 *   (query: string) => {
 *     console.log('Searching for:', query);
 *   },
 *   500
 * );
 *
 * return <input onChange={(e) => handleSearch(e.target.value)} />;
 * ```
 *
 * @example
 * ```tsx
 * // 使用 leading: true 在第一次立即执行
 * const handleSend = useDebounce(
 *   async () => {
 *     await sendMessage(message);
 *   },
 *   300,
 *   { leading: true, trailing: false }
 * );
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options?: DebounceSettings,
) {
  // 使用 ref 保存最新的 callback，避免闭包陷阱
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // 创建稳定的 debounced 函数（只创建一次）
  const debouncedFn = useMemo(
    () =>
      debounce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/refs
        (...args: any[]) => {
          return callbackRef.current(...args);
        },
        delay,
        options,
      ),
    [delay, options],
  );

  // 清理函数：组件卸载时取消防抖
  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
}
