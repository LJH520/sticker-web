/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { defaultLocale } from '../i18n/config';
import { Decorator, StoryContext } from '@storybook/nextjs';
import { getMessages } from './request';

/** next-intl Storybook装饰器 */
export const IntlDecorator: Decorator = (Story, context: StoryContext) => {
  const locale = context.globals.locale || defaultLocale; // 获取全局语言设置
  const [messages, setMessages] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    // 异步加载翻译内容
    getMessages(locale).then(setMessages);
  }, [locale]);

  // 等待消息加载完成
  if (!messages) {
    return <div>Loading next-intl messages...</div>;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Story />
    </NextIntlClientProvider>
  );
};
