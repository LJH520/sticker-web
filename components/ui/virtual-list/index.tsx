'use client';

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import RcVirtualList from 'rc-virtual-list';
import { cn } from '@/lib/utils';

export interface VirtualListRef {
  /**
   * 滚动到指定位置
   */
  scrollTo: (config: {
    index?: number;
    offset?: number;
    align?: 'top' | 'bottom' | 'auto';
  }) => void;
  /**
   * 滚动到底部
   */
  scrollToBottom: () => void;
  /**
   * 滚动到顶部
   */
  scrollToTop: () => void;
  /**
   * 获取当前滚动元素
   */
  getScrollElement: () => HTMLElement | null;
  /**
   * 保持滚动位置（用于顶部插入数据后）
   *
   * 使用场景：向上滚动加载历史数据时，保持用户看到的位置不变
   *
   * @param addedCount 新增的数据条数
   *
   * @example
   * // 加载历史消息
   * const loadHistory = async () => {
   *   const history = await fetchHistory();
   *   setMessages([...history, ...messages]); // 插入到顶部
   *
   *   setTimeout(() => {
   *     listRef.current?.maintainScrollPosition(history.length);
   *   }, 0);
   * };
   */
  maintainScrollPosition: (addedCount: number) => void;
}

export interface VirtualListProps<T> {
  /**
   * 数据列表
   */
  data: T[];

  /**
   * 渲染每一项的函数
   */
  renderItem: (item: T, index: number) => React.ReactNode;

  /**
   * 每一项的高度（像素）
   */
  itemHeight?: number;

  /**
   * 容器的类名
   * 支持 flex-1, h-100%, h-screen 等动态高度类名
   */
  className?: string;

  /**
   * 容器固定高度（像素）
   * 如果设置了此值，将优先使用固定高度，忽略动态高度
   */
  height?: number;

  /**
   * 列表项的 key 提取函数
   * @default (item,index) => index
   */
  getItemKey?: (item: T) => string | number;

  /**
   * 是否显示加载中状态
   * @default false
   */
  loading?: boolean;

  /**
   * 加载中时的占位内容
   */
  loadingContent?: React.ReactNode;

  /**
   * 数据为空时的占位内容
   */
  emptyContent?: React.ReactNode;

  /**
   * 滚动事件回调
   */
  onScroll?: (e: React.UIEvent<HTMLElement>) => void;

  /**
   * 滚动到顶部的回调（距离顶部 threshold 像素时触发）
   *
   * @returns 返回新增的数据条数，用于自动调整滚动位置（避免闪动）
   *          - 返回 0 或 undefined：不调整位置
   *          - 返回 > 0：自动滚动到第 N 项（原来的第 0 项）
   *
   * @example
   * const loadHistory = async () => {
   *   const history = await fetchHistory();
   *   setMessages([...history, ...messages]);
   *   return history.length; // 返回新增数量，VirtualList 自动调整位置
   * };
   */
  onReachTop?: () => Promise<number | void> | number | void;

  /**
   * 触发 onReachTop 的距离阈值（像素）
   * @default 50
   */
  reachTopThreshold?: number;

  /**
   * 滚动到底部的回调（距离底部 threshold 像素时触发）
   */
  onReachBottom?: () => void;

  /**
   * 触发 onReachBottom 的距离阈值（像素）
   * @default 50
   */
  reachBottomThreshold?: number;

  /**
   * 内部列表样式
   */
  listClassName?: string;

  /**
   * 列表项样式
   */
  itemClassName?: string;

  /**
   * 当数据长度增加时，是否自动滚动到底部
   * @default false
   */
  autoScrollToBottom?: boolean;

  /**
   * 自动滚动到底部时的延迟（毫秒）
   * @default 100
   */
  autoScrollDelay?: number;
}

/**
 * 通用虚拟列表组件
 * 支持动态容器高度（flex-1, h-100% 等）和固定高度
 *
 * @example
 * // 使用 flex-1
 * <VirtualList
 *   data={items}
 *   renderItem={(item) => <div>{item.name}</div>}
 *   itemHeight={50}
 *   className="flex-1"
 * />
 *
 * @example
 * // 使用固定高度
 * <VirtualList
 *   data={items}
 *   renderItem={(item) => <div>{item.name}</div>}
 *   itemHeight={50}
 *   height={400}
 * />
 *
 * @example
 * // 使用 ref 控制滚动
 * const listRef = useRef<VirtualListRef>(null);
 * <VirtualList ref={listRef} ... />
 * // 滚动到底部
 * listRef.current?.scrollToBottom();
 */
function VirtualListInner<T = Record<string, unknown>>(
  {
    data,
    renderItem,
    itemHeight,
    className,
    height: fixedHeight,
    getItemKey,
    loading = false,
    loadingContent,
    emptyContent,
    onScroll,
    onReachTop,
    reachTopThreshold = 50,
    onReachBottom,
    reachBottomThreshold = 50,
    listClassName,
    itemClassName,
    autoScrollToBottom = false,
    autoScrollDelay = 100,
  }: VirtualListProps<T>,
  ref: React.Ref<VirtualListRef>,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listRef = useRef<any>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const scrollStateRef = useRef({
    isScrollingToBottom: false,
    isScrollingToTop: false,
    bottomTimer: null as NodeJS.Timeout | null,
    topTimer: null as NodeJS.Timeout | null,
  });
  const prevDataLengthRef = useRef(data.length);

  // 用于检测滚动方向
  const prevScrollTopRef = useRef(0);
  // 用于检测是否在阈值范围内
  const isInTopThresholdRef = useRef(false);
  const isInBottomThresholdRef = useRef(false);
  // 用于存储待调整的滚动位置
  const pendingScrollIndexRef = useRef<number | null>(null);


  const defaultGetItemKey = (item: T): string | number => {
    // 尝试获取 id 属性
    if (item && typeof item === 'object' && 'id' in item) {
      return String((item as Record<string, unknown>).id);
    }
    // 否则使用对象本身的字符串表示
    return String(item);
  };

  const actualGetItemKey = getItemKey || defaultGetItemKey;

  // 暴露滚动控制方法给父组件
  useImperativeHandle(ref, () => ({
    scrollTo: (config) => {
      if (listRef.current) {
        if (config.index !== undefined) {
          listRef.current.scrollTo({ index: config.index, align: config.align || 'auto' });
        } else if (config.offset !== undefined) {
          listRef.current.scrollTo({ offset: config.offset });
        }
      }
    },
    scrollToBottom: () => {
      if (listRef.current && data.length > 0) {
        // 滚动到最后一项
        listRef.current.scrollTo({ index: data.length - 1, align: 'bottom' });
      }
    },
    scrollToTop: () => {
      if (listRef.current) {
        listRef.current.scrollTo({ index: 0, align: 'top' });
      }
    },
    getScrollElement: () => listRef.current?.nativeElement || null,
    maintainScrollPosition: (addedCount: number) => {
      if (listRef.current) {
        // 原来的第 0 项现在变成了第 addedCount 项
        // 直接滚动到那个位置即可
        listRef.current.scrollTo({
          index: addedCount,
          align: 'top',
        });
      }
    },
  }));

  // 自动调整滚动位置（在数据变化后立即执行，避免闪动）
  useLayoutEffect(() => {
    if (pendingScrollIndexRef.current !== null && listRef.current) {
      listRef.current.scrollTo({
        index: pendingScrollIndexRef.current,
        align: 'top',
      });
      pendingScrollIndexRef.current = null;
    }
  }, [data]);

  // 自动滚动到底部（当数据长度增加时）
  useEffect(() => {
    if (autoScrollToBottom && data.length > prevDataLengthRef.current && listRef.current) {
      const timer = setTimeout(() => {
        if (listRef.current && data.length > 0) {
          // 滚动到最后一项
          listRef.current.scrollTo({ index: data.length - 1, align: 'bottom' });
        }
      }, autoScrollDelay);

      return () => clearTimeout(timer);
    }
    prevDataLengthRef.current = data.length;
  }, [data.length, autoScrollToBottom, autoScrollDelay]);

  // 监听容器高度变化（用于 flex-1, h-100% 等动态高度）
  useEffect(() => {
    if (fixedHeight) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContainerHeight(fixedHeight);
      return;
    }

    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        if (height > 0) {
          setContainerHeight(height);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    // 初始化高度
    const initialHeight = containerRef.current.offsetHeight;
    if (initialHeight > 0) {
      setContainerHeight(initialHeight);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [fixedHeight]);

  // 处理滚动事件
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    onScroll?.(e);

    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    // 计算滚动方向
    const scrollDirection = scrollTop < prevScrollTopRef.current ? 'up' : 'down';

    // 检查是否滚动到顶部
    if (onReachTop) {
      const distanceToTop = scrollTop;
      const isInThreshold = distanceToTop <= reachTopThreshold;

      // 条件：1) 向上滚动 2) 在阈值范围内 3) 之前不在阈值范围内（刚进入）
      if (scrollDirection === 'up' && isInThreshold && !isInTopThresholdRef.current) {
        // 防抖：避免快速滚动时多次触发
        if (!scrollStateRef.current.isScrollingToTop) {
          scrollStateRef.current.isScrollingToTop = true;

          // 调用 onReachTop 并处理返回值（可能是 Promise 或同步值）
          const result = onReachTop();
          if (result instanceof Promise) {
            result.then((addedCount) => {
              if (addedCount && addedCount > 0) {
                pendingScrollIndexRef.current = addedCount;
              }
            });
          } else if (result && result > 0) {
            pendingScrollIndexRef.current = result;
          }

          // 500ms 后重置状态
          if (scrollStateRef.current.topTimer) {
            clearTimeout(scrollStateRef.current.topTimer);
          }
          scrollStateRef.current.topTimer = setTimeout(() => {
            scrollStateRef.current.isScrollingToTop = false;
          }, 500);
        }
      }

      // 更新阈值范围状态
      isInTopThresholdRef.current = isInThreshold;
    }

    // 检查是否滚动到底部
    if (onReachBottom) {
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      const isInThreshold = distanceToBottom <= reachBottomThreshold;

      // 条件：1) 向下滚动 2) 在阈值范围内 3) 之前不在阈值范围内（刚进入）
      if (scrollDirection === 'down' && isInThreshold && !isInBottomThresholdRef.current) {
        // 防抖：避免快速滚动时多次触发
        if (!scrollStateRef.current.isScrollingToBottom) {
          scrollStateRef.current.isScrollingToBottom = true;
          onReachBottom();

          // 500ms 后重置状态
          if (scrollStateRef.current.bottomTimer) {
            clearTimeout(scrollStateRef.current.bottomTimer);
          }
          scrollStateRef.current.bottomTimer = setTimeout(() => {
            scrollStateRef.current.isScrollingToBottom = false;
          }, 500);
        }
      }

      // 更新阈值范围状态
      isInBottomThresholdRef.current = isInThreshold;
    }

    // 更新上一次滚动位置
    prevScrollTopRef.current = scrollTop;
  };

  // 清理定时器
  useEffect(() => {
    const scrollState = scrollStateRef.current;
    return () => {
      if (scrollState.bottomTimer) {
        clearTimeout(scrollState.bottomTimer);
      }
      if (scrollState.topTimer) {
        clearTimeout(scrollState.topTimer);
      }
    };
  }, []);

  // 渲染加载状态
  if (loading && loadingContent) {
    return (
      <div
        ref={containerRef}
        className={cn('relative overflow-hidden', className)}
        style={fixedHeight ? { height: fixedHeight } : undefined}
      >
        {loadingContent}
      </div>
    );
  }

  // 渲染空状态
  if (!loading && data.length === 0 && emptyContent) {
    return (
      <div
        ref={containerRef}
        className={cn('relative flex items-center justify-center overflow-hidden', className)}
        style={fixedHeight ? { height: fixedHeight } : undefined}
      >
        {emptyContent}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={fixedHeight ? { height: fixedHeight } : undefined}
    >
      {containerHeight > 0 && (
        <RcVirtualList
          ref={listRef}
          data={data}
          height={containerHeight}
          itemHeight={itemHeight}
          itemKey={actualGetItemKey}
          onScroll={handleScroll}
          virtual
          prefixCls="rc-virtual-list"
          className={cn('overflow-auto', listClassName)}
          style={{ maxHeight: containerHeight }}
        >
          {(item, index) => (
            <div key={actualGetItemKey(item)} className={itemClassName}>
              {renderItem(item, index)}
            </div>
          )}
        </RcVirtualList>
      )}
    </div>
  );
}

// 使用 forwardRef 包装组件以支持 ref
export const VirtualList = forwardRef(VirtualListInner) as <T = Record<string, unknown>>(
  props: VirtualListProps<T> & { ref?: React.Ref<VirtualListRef> },
) => React.ReactElement;

export default VirtualList;
