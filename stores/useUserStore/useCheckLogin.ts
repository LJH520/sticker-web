import { useLoginDialogStore } from '@/components/login-dialog';
import useUserStore from '@/stores/useUserStore';
import { useEffect, useRef } from 'react';

/** 检查是否登录，未登录打开登录弹框，已登录执行成功回调 */
export default function useCheckLogin(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback?: any,
  options?: {
    /** 是否显示弹框
     * @default true
     */
    showDialog?: boolean;
  },
) {
  const isInit = useUserStore((state) => state.isInit);

  const callbackRef = useRef(callback);
  // 更新回调引用
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isInit) return;
    const showDialog = options?.showDialog ?? true;
    const isLogin = useUserStore.getState().userInfo?.userId;
    if (!isLogin && showDialog) {
      useLoginDialogStore.getState().openDialog();
      return;
    }

    callbackRef?.current?.();
  }, [isInit, options?.showDialog]);
}

/** 检查是否登录，未登录打开登录弹框 */
export async function checkLogin(options?: {
  /** 是否显示弹框
   * @default true
   */
  showDialog?: boolean;
}) {
  const isLogin = useUserStore.getState().userInfo?.userId;
  const showDialog = options?.showDialog ?? true;
  if (!isLogin && showDialog) {
    if (showDialog) {
      useLoginDialogStore.getState().openDialog();
    }
    throw new Error('[checkLogin] 用户未登录，请先登录');
  }
}
