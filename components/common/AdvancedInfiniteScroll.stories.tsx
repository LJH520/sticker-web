/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/nextjs';
import React, { useState, useRef, useEffect } from 'react';
import { AdvancedInfiniteScroll } from './AdvancedInfiniteScroll';

const meta = {
  title: 'UI 组件/AdvancedInfiniteScroll 无限滚动',
  component: AdvancedInfiniteScroll,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdvancedInfiniteScroll>;

export default meta;
type Story = StoryObj<typeof meta>;

// 模拟数据生成函数
const generateItems = (start: number, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i,
    title: `Item ${start + i}`,
    content: `This is content for item ${start + i}`,
  }));
};

// Vertical 纵向滚动示例
export const Vertical: Story = {
  args: {} as any,
  render: () => {
    const [items, setItems] = useState(generateItems(1, 20));
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
      setLoading(true);
      // 模拟网络请求延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const nextItems = generateItems(items.length + 1, 20);
      setItems([...items, ...nextItems]);

      // 模拟加载到 100 条后没有更多数据
      if (items.length + nextItems.length >= 100) {
        setHasMore(false);
      }
      setLoading(false);
    };

    return (
      <div className="h-screen overflow-auto p-4">
        <h2 className="mb-4 text-2xl font-bold">纵向无限滚动</h2>
        <AdvancedInfiniteScroll
          fetchData={fetchData}
          hasMore={hasMore}
          loading={loading}
          direction="vertical"
        >
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
              </div>
            ))}
          </div>
        </AdvancedInfiniteScroll>
      </div>
    );
  },
};

// Horizontal 横向滚动示例
export const Horizontal: Story = {
  args: {} as any,
  render: () => {
    const [items, setItems] = useState(generateItems(1, 10));
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const nextItems = generateItems(items.length + 1, 10);
      setItems([...items, ...nextItems]);

      if (items.length + nextItems.length >= 50) {
        setHasMore(false);
      }
      setLoading(false);
    };

    return (
      <div className="p-4">
        <h2 className="mb-4 text-2xl font-bold">横向无限滚动</h2>
        <div className="overflow-x-auto">
          <AdvancedInfiniteScroll
            fetchData={fetchData}
            hasMore={hasMore}
            loading={loading}
            direction="horizontal"
          >
            <div className="flex gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="h-64 w-64 shrink-0 rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-600">{item.content}</p>
                </div>
              ))}
            </div>
          </AdvancedInfiniteScroll>
        </div>
      </div>
    );
  },
};

// Chat 模式示例（从顶部加载历史消息）
export const ChatMode: Story = {
  args: {} as any,
  render: () => {
    const [messages, setMessages] = useState(
      generateItems(81, 20).reverse(), // 从第 81-100 条开始（最新的消息）
    );
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 获取更旧的消息（ID 更小）
      const oldestId = Math.min(...messages.map((m) => m.id));
      const olderMessages = generateItems(
        Math.max(1, oldestId - 20),
        Math.min(20, oldestId - 1),
      ).reverse();

      setMessages([...olderMessages, ...messages]);

      // 如果已经加载到第 1 条消息，则没有更多
      if (oldestId <= 1) {
        setHasMore(false);
      }
      setLoading(false);
    };

    // 初始化时滚动到底部
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, []);

    return (
      <div className="p-4">
        <h2 className="mb-4 text-2xl font-bold">聊天模式（向上滚动加载历史消息）</h2>
        <div
          ref={scrollRef}
          className="h-[600px] overflow-y-auto rounded-lg border border-gray-300 bg-gray-50 p-4"
        >
          <AdvancedInfiniteScroll
            fetchData={fetchData}
            hasMore={hasMore}
            loading={loading}
            direction="chat"
            scrollContainer={scrollRef}
          >
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`rounded-lg p-3 ${
                    index % 2 === 0
                      ? 'ms-auto max-w-[70%] bg-blue-500 text-white'
                      : 'me-auto max-w-[70%] bg-white'
                  }`}
                >
                  <p className="text-sm font-medium">{msg.title}</p>
                  <p className="text-xs opacity-90">{msg.content}</p>
                </div>
              ))}
            </div>
          </AdvancedInfiniteScroll>
        </div>
        <p className="mt-2 text-sm text-gray-600">提示：向上滚动以加载更多历史消息</p>
      </div>
    );
  },
};

// 自定义加载器和结束消息
export const CustomLoaderAndEndMessage: Story = {
  args: {} as any,
  render: () => {
    const [items, setItems] = useState(generateItems(1, 15));
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const nextItems = generateItems(items.length + 1, 15);
      setItems([...items, ...nextItems]);

      if (items.length + nextItems.length >= 60) {
        setHasMore(false);
      }
      setLoading(false);
    };

    return (
      <div className="h-screen overflow-auto p-4">
        <h2 className="mb-4 text-2xl font-bold">自定义加载器和结束消息</h2>
        <AdvancedInfiniteScroll
          fetchData={fetchData}
          hasMore={hasMore}
          loading={loading}
          direction="vertical"
          loader={
            <div className="flex items-center justify-center py-6">
              <div className="flex items-center gap-2 text-blue-600">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <span className="text-sm font-medium">加载中...</span>
              </div>
            </div>
          }
          endMessage={
            <div className="py-8 text-center">
              <p className="text-lg font-semibold text-gray-700">🎉 已加载全部内容</p>
              <p className="mt-1 text-sm text-gray-500">共 {items.length} 条数据</p>
            </div>
          }
        >
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4 shadow-md"
              >
                <h3 className="font-bold text-blue-700">{item.title}</h3>
                <p className="text-gray-700">{item.content}</p>
              </div>
            ))}
          </div>
        </AdvancedInfiniteScroll>
      </div>
    );
  },
};

// 使用自定义阈值
export const CustomThreshold: Story = {
  args: {} as any,
  render: () => {
    const [items, setItems] = useState(generateItems(1, 10));
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const nextItems = generateItems(items.length + 1, 10);
      setItems([...items, ...nextItems]);

      if (items.length + nextItems.length >= 50) {
        setHasMore(false);
      }
      setLoading(false);
    };

    return (
      <div className="h-screen overflow-auto p-4">
        <h2 className="mb-4 text-2xl font-bold">自定义触发阈值</h2>
        <p className="mb-4 text-sm text-gray-600">当距离底部还有 300px 时就开始加载下一页</p>
        <AdvancedInfiniteScroll
          fetchData={fetchData}
          hasMore={hasMore}
          loading={loading}
          direction="vertical"
          threshold={300} // 提前 300px 触发加载
        >
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
                <p className="mt-2 text-xs text-gray-400">当前共 {items.length} 条数据</p>
              </div>
            ))}
          </div>
        </AdvancedInfiniteScroll>
      </div>
    );
  },
};
