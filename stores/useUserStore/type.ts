import { RequestParams, UserInfoResp, UserInfoSigResp, UserLoginReq } from '@/api';

export interface State {
  /** 用户信息 */
  userInfo?: Partial<UserInfoResp & UserInfoSigResp>;
  /** 是否已经初始化，获取了数据 */
  isInit: boolean;
}

export interface Action {
  /** 重置 */
  reset: () => void;

  /** 初始化数据 */
  init: (params?: RequestParams) => Promise<void>;
  /** 获取并设置当前用户信息 */
  getUserInfo: () => Promise<void>;
  /** 登录 */
  login: (data: UserLoginReq, params?: RequestParams) => Promise<void>;
  /** 登出 */
  logout: () => Promise<void>;
}

export type Store = State & Action;
