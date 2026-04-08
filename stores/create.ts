// import { createStore, StateCreator } from 'zustand/vanilla';

import { create, StateCreator } from 'zustand';
import { devtools, StateStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// 安全地访问 localStorage（避免 SSR 问题）
export const getClientStorage = (): StateStorage | undefined => {
  if (typeof window !== 'undefined') {
    return localStorage;
  }
  return undefined;
};

/** 创建Zustand Store, with: devtools,immer */

/**
 * 创建带有 devtools 和 immer 的 Zustand Store 高阶函数
 * @param name Store 名称（用于 Redux DevTools 标识）
 * @param createState 状态创建函数
 * @returns 创建好的 Zustand Store
 *
 * @example
 * type Store = {
 *   count: number;
 *   increment: () => void;
 * };
 *
 * const createStore = (name: string) =>
 *   createZustandStore<Store>(name, (set) => ({
 *     count: 0,
 *
 *     increment: () => set((state) => { state.count += 1; }),
 * }));
 */
const createZustandStore = <T>(
  /** Store名称 */
  name: string,
  /** 创建函数 */
  createState: StateCreator<T, [['zustand/devtools', never], ['zustand/immer', never]], []>,
) => {
  return create(
    devtools(immer(createState), {
      name: name,
      enabled: process.env.NODE_ENV === 'development',
    }),
  );
};

export default createZustandStore;
