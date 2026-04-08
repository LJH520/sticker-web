import createZustandStore from '@/stores/create';
import { has } from 'lodash-es';

interface State<T = undefined> {
  /** 对话框是否可见 */
  open: boolean;
  /** 数据 */
  data: T | undefined;
}

interface Action<T = undefined> {
  /** 对话框可见性变化时触发 */
  onOpenChange: (open: boolean) => Promise<void>;
  /** 打开对话框 */
  openDialog: (params?: { data?: T }) => Promise<void>;
  /** 关闭对话框 */
  closeDialog: (params?: { data?: T }) => Promise<void>;
}

type Store<T = undefined> = State<T> & Action<T>;

const initialState: State = {
  open: false,
  data: undefined,
};

/** 创建对话框模块 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createDialogStore = <T = any>(
  /** Store名称 */
  name: string,
  state?: State<T>,
) =>
  createZustandStore<Store<T>>(name, (set) => ({
    ...initialState,
    ...(state || {}),

    onOpenChange: async (open) => {
      set((state) => {
        state.open = open;
      });
    },
    openDialog: async (params) => {
      set((state) => {
        state.open = true;
        if (has(params, 'data')) {
          state.data = params.data;
        }
      });
    },
    closeDialog: async (params) => {
      set((state) => {
        state.open = false;
        if (has(params, 'data')) {
          state.data = params.data;
        }
      });
    },
  }));
