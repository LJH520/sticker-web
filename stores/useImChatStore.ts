import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { Conversation, Message } from '@tencentcloud/chat';

// export type MessageItem = Partial<Message>;

export interface IRoomUserInfo {
  userName?: string;
  roomId?: string; // 对应群组 ID
  userId?: string;
  sdkAppId?: number;
  userSig?: string;
}

export interface State {
  /** 当前room登录用户信息 (精简后主要用于存储IM登录信息) */
  myInfo: IRoomUserInfo;
  /** TIM 消息列表 */
  messageList: Message[];
  /** TIM 历史消息是否拉完 */
  isCompleted: boolean;
  /** TIM 是否正在拉取历史消息 */
  loading: boolean;
  /** TIM 拉取历史消息的游标 */
  nextReqMessageId: string;
  /** TIM 对话列表 */
  conversationList: Conversation[];
}

export interface Action {
  /** 设置 我的 信息 */
  setMyInfo: (list: IRoomUserInfo) => void;
  // -------- TIM 消息列表相关 --------
  /** 设置消息列表 */
  setMessageList: (list: Message[]) => void;
  /** 设置是否拉完消息列表 */
  setIsCompleted: (b: boolean) => void;
  /** 设置下一次拉取消息列表的游标 */
  setNextReqMessageId: (s: string) => void;
  /** 更新消息列表 (新增或去重) */
  updateMessageList: (message: Message) => void;
  /** 设置消息列表加载中 */
  setLoading: (b: boolean) => void;
  /** 设置对话列表 */
  setConversationList: (list: Conversation[]) => void;
}

export type Store = State & Action;

const initialState: State = {
  myInfo: {
    userName: '',
    roomId: '',
    userId: '',
    sdkAppId: 0,
    userSig: '',
  },
  // -------- TIM 消息列表相关 --------
  messageList: [],
  isCompleted: false,
  nextReqMessageId: '',
  loading: false,
  conversationList: [],
};

export const useImChatStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setMyInfo: (info) =>
          set((state) => ({
            myInfo: { ...state.myInfo, ...info },
          })),
        // -------- 以下 TIM 消息列表相关 --------
        setMessageList: (list) => set({ messageList: list }),
        setIsCompleted: (b) => set({ isCompleted: b }),
        setNextReqMessageId: (str) => set({ nextReqMessageId: str }),
        setLoading: (b) => set({ loading: b }),
        updateMessageList(message) {
          const { messageList } = get();
          // 使用 ID 进行去重判断
          const messageIds = messageList.map((msg) => msg.ID);

          if (message.ID && messageIds.indexOf(message.ID) === -1) {
            const newMessageList = messageList.concat([message]);
            set(() => ({
              messageList: newMessageList,
            }));
          }
        },
        setConversationList: (list) => set({ conversationList: list }),
      }),
      {
        name: 'useImChatStore',
        storage: createJSONStorage(() => sessionStorage),
        partialize: () => ({}), // 不持久化状态
      },
    ),
  ),
);
