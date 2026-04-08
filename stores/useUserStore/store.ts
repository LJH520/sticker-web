import { State, Store } from './type';
import createZustandStore from '../create';
import { createClientApi } from '@/api';
import { setUserAuthorization } from '@/lib/auth';

const initialState: State = {
  userInfo: undefined,
  isInit: false,
};

/** 用户信息 */
export const createStore = (
  /** Store名称 */
  name: string,
  /** 状态初始值 */
  state?: Partial<State>,
) =>
  createZustandStore<Store>(name, (set) => ({
    ...initialState,
    ...(state || {}),
    reset: () => {
      set((state) => {
        state.userInfo = undefined;
        state.isInit = false;
      });
    },

    init: async (params) => {
      const api = createClientApi();
      const [userInfo, userSig] = await Promise.all([
        api.getUserInfo(params).then((res) => res?.data?.data),
        api.getUserInfoSig(params).then((res) => res?.data?.data),
      ]);
      set((state) => {
        state.userInfo = { ...(userInfo || {}), ...(userSig || {}) };
        state.isInit = true;
      });
    },
    getUserInfo: async () => {
      const api = createClientApi();
      const [userInfo, userSig] = await Promise.all([
        api.getUserInfo().then((res) => res?.data?.data),
        api.getUserInfoSig().then((res) => res?.data?.data),
      ]);
      set((state) => {
        state.userInfo = { ...(userInfo || {}), ...(userSig || {}) };
      });
    },
    login: async (params, configs) => {
      const api = createClientApi();
      const accessToken = await api
        .login(params, configs)
        ?.then((res) => res?.data?.data?.accessToken || '');
      setUserAuthorization(accessToken);
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },
    logout: async () => {
      const api = createClientApi();
      await api.logout();
      setUserAuthorization('');
      set((state) => {
        state.userInfo = undefined;
      });
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },
  }));
