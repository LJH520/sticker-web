'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

interface AdvancedInfiniteScrollProps {
  fetchData: () => Promise<void> | void;
  hasMore: boolean;
  loading?: boolean;
  threshold?: number;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  scrollContainer?: React.RefObject<HTMLElement | null>;
  direction?: 'vertical' | 'horizontal' | 'chat'; // 👈 新增
}

export function AdvancedInfiniteScroll({
  fetchData,
  hasMore,
  loading = false,
  threshold = 100,
  loader,
  endMessage,
  children,
  className = '',
  scrollContainer,
  direction = 'vertical', // 默认纵向
}: AdvancedInfiniteScrollProps) {
  const t = useTranslations('common.message');

  const isHorizontal = direction === 'horizontal';
  const isChat = direction === 'chat';

  // chat 模式下哨兵在顶部，否则在底部/右侧
  const { ref, inView } = useInView({
    threshold: 0,
    root: scrollContainer?.current || null,
    rootMargin: isChat
      ? `${threshold}px 0px 0px 0px` // 向下预加载：触发顶部
      : isHorizontal
        ? `0px ${threshold}px 0px 0px` // 横向：右边预加载
        : `${threshold}px 0px 0px 0px`, // 竖向：底部预加载
  });

  const isFetchingRef = useRef(false);

  // ----- ⭐ chat 模式的滚动位置修复
  // 加载前 scrollHeight
  const prevScrollHeightRef = useRef<number>(0);

  const handleLoadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || loading) return;

    const containerEl = scrollContainer?.current;

    if (isChat && containerEl) {
      // 保存加载前高度
      prevScrollHeightRef.current = containerEl.scrollHeight;
      console.log('加载前高度:', prevScrollHeightRef.current);
    }

    isFetchingRef.current = true;
    try {
      await fetchData();
    } finally {
      if (isChat && containerEl) {
        setTimeout(() => {
          containerEl.getBoundingClientRect(); // 触发重绘
          // 加载后，计算高度差
          const newHeight = containerEl.scrollHeight;
          console.log('加载后高度:', newHeight);
          const delta = newHeight - prevScrollHeightRef.current;
          console.log('加载后高度差:', delta);

          // ⭐保持当前位置：向下补偿高度差
          containerEl.scrollTop += delta;

          isFetchingRef.current = false;
        }, 50);
      } else {
        isFetchingRef.current = false;
      }
    }
  }, [fetchData, hasMore, loading, scrollContainer, isChat]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      handleLoadMore();
    }
  }, [inView, hasMore, loading, handleLoadMore]);

  // 默认 loader
  const defaultLoader = () => (
    <div
      className={cn('flex items-center justify-center', {
        'h-full px-4': isHorizontal,
        'py-4': !isHorizontal,
      })}
    >
      <Loader2 className="animate-spin" />
    </div>
  );

  // 默认结束消息
  const defaultEndMessage = () => (
    <div
      className={
        isHorizontal
          ? 'me-2 flex h-full items-center justify-center py-4 text-center text-sm text-gray-500'
          : 'py-4 text-center text-sm text-gray-500'
      }
    >
      {t('noMoreData')}
    </div>
  );

  // 外层 flex，仅 horizontal 模式需要
  const containerCls = `${className} ${isHorizontal ? 'flex flex-row' : ''}`;

  return (
    <div data-slot="scroll-container" className={containerCls}>
      {/* chat 模式：哨兵放顶部 */}
      {isChat && (
        <div ref={ref} className="min-h-[1px]">
          {hasMore ? loading && (loader || defaultLoader()) : endMessage || defaultEndMessage()}
        </div>
      )}

      {/* 内容 */}
      {children}

      {/* 其他模式：哨兵放底部/右侧 */}
      {!isChat && (
        <div ref={ref} className={isHorizontal ? 'min-w-[48px]' : 'min-h-[1px]'}>
          {hasMore ? loading && (loader || defaultLoader()) : endMessage || defaultEndMessage()}
        </div>
      )}
    </div>
  );
}
