/*
 * 通用store放这里，只有一个页面使用的store放页面文件夹下
 * 简单的store，直接单文件即可， 复杂的store可以拆分为多个文件
 *
 */
import { create } from 'zustand';
// 引入中间件
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

// 回调函数不接受参数
export type AudioOnEndedCallback = () => void;

// --- 1. 定义类型接口 ---

interface AudioState {
  /** 当前的 HTML Audio 元素实例 */
  audioInstance: HTMLAudioElement | null;
  /** 是否正在播放 (不包括暂停) */
  isPlaying: boolean;
  /** 是否处于暂停状态 */
  isPaused: boolean;
  /** 是否静音 (此状态会被持久化) */
  isMuted: boolean;
  /** 外部传入的播放完成回调事件 */
  onEndedCallback: AudioOnEndedCallback | null;
}

interface AudioActions {
  /** 播放新的音频或恢复当前音频 */
  play: (src?: string) => void;
  /** 暂停播放 */
  pause: () => void;
  /** 切换静音状态，可选传入布尔值强制设置 */
  toggleMute: (mute?: boolean) => void;
  /** 停止并清理当前播放 */
  stop: () => void;
  /** 设置回调函数的方法 */
  setOnEndedCallback: (callback: AudioOnEndedCallback | null) => void;
}

// 组合 Store 类型
type AudioStore = AudioState & AudioActions;

// --- 2. 初始状态 ---

const initialState: AudioState = {
  audioInstance: null,
  isPlaying: false,
  isPaused: false,
  onEndedCallback: null, // <-- 初始值设为 null
  // isMuted 的初始值会被 persist 中间件从 localStorage 中加载的值覆盖
  isMuted: false,
};

// --- 3. 创建并包装 Zustand Store ---

export const useAudioStore = create<AudioStore>()(
  // 3.1. persist 包装 devtools
  persist(
    // 3.2. devtools 包装核心 store 逻辑
    devtools(
      (set, get) => ({
        ...initialState,
        // --- 设置回调函数的方法 ---
        setOnEndedCallback: (callback: AudioOnEndedCallback | null) => {
          set({ onEndedCallback: callback });
        },

        play: (src) => {
          const { audioInstance, isPaused } = get();

          // 1. 播放新的音频
          if (src) {
            // 如果已经存在实例，复用它
            if (audioInstance) {
              console.info('复用现有 Audio 实例，更换音频源');
              // 暂停当前播放
              audioInstance.pause();
              // 重置播放位置
              audioInstance.currentTime = 0;
              // 更换音频源
              audioInstance.src = src;
              // 应用静音状态
              audioInstance.muted = get().isMuted;
            } else {
              // 第一次播放，创建新实例
              console.info('创建新的 Audio 实例');
              const newAudio = new Audio(src);

              // 监听播放完成事件
              newAudio.onended = () => {
                console.info('播放完成事件触发:', newAudio.src);

                // 先重置非持久化状态，保持 isMuted 状态
                set((state) => ({
                  isPlaying: false,
                  isPaused: false,
                  onEndedCallback: state.onEndedCallback, // 保持回调
                }));

                // ** 然后执行外部传入的回调函数（可能会重新调用 play） **
                const currentCallback = get().onEndedCallback;
                if (currentCallback) {
                  currentCallback();
                }
              };

              // 应用持久化的静音状态到新的 Audio 实例
              newAudio.muted = get().isMuted;

              // 保存实例到 state
              set({
                audioInstance: newAudio,
              });
            }

            // 播放音频
            const currentAudio = get().audioInstance;
            if (currentAudio) {
              currentAudio.play().catch((error) => {
                console.error('播放音频失败 (可能被浏览器阻止):', error);
                set({
                  isPlaying: false,
                  isPaused: false,
                });
              });
              console.log('播放音频成功');
              set({
                isPlaying: true,
                isPaused: false,
              });
            }
          }
          // 2. 恢复播放
          else if (audioInstance && isPaused) {
            audioInstance.play();
            set({
              isPlaying: true,
              isPaused: false,
            });
          }
        },

        pause: () => {
          const { audioInstance, isPlaying } = get();
          if (audioInstance && isPlaying) {
            audioInstance.pause();
            set({
              isPlaying: false,
              isPaused: true,
            });
          }
        },

        toggleMute: (mute) => {
          const { audioInstance, isMuted } = get();
          const newMuted = typeof mute === 'boolean' ? mute : !isMuted;

          if (audioInstance) {
            audioInstance.muted = newMuted;
          }
          // isMuted 的变化会被 persist 自动存储
          set({ isMuted: newMuted });
        },

        stop: () => {
          const { audioInstance } = get();
          if (audioInstance) {
            audioInstance.pause();
            audioInstance.onended = null;
          }
          // 重置非持久化状态，保持 isMuted 状态
          set((state) => ({
            ...initialState,
            isMuted: state.isMuted,
          }));
        },
      }),
      // Devtools 配置：在 Redux Devtools 扩展中显示的名称
      { name: 'Global Audio Player Store' },
    ),
    // Persist 配置：定义如何持久化和加载状态
    {
      name: 'audio-player-storage', // 在 localStorage/sessionStorage 中使用的键名
      storage: createJSONStorage(() => sessionStorage),
      // 只持久化 指定字段
      partialize: (state) => ({
        // isMuted: state.isMuted,
      }),
    },
  ),
);
