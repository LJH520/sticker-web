# 国际化

- 使用next-intl进行国际化

## 目录结构

- `i18n` 目录下包含国际化配置
- `message` 目录下包含所有语言的国际化文件
  - app.json: 应用页面相关翻译
  - common.json: 通用翻译（表单、消息等）
  - components.json: 通用组件的翻译

## 使用示例：

- 在服务器组件中使用

```
import { getTranslations } from 'next-intl/server';

export default async function ServerComponent() {
  // 使用 app namespace
  const t = await getTranslations('app.home');
  const title = t('title');

  return <div>{title}</div>;
}
```

- 在客户端组件中使用

```
'use client';
import { useTranslations } from 'next-intl';

export function ClientComponent() {
  // 使用 app namespace
  const t = useTranslations('app.home');
  const title = t('title');

  return <div>{title}</div>;
}
```

## AI 提示词

- 添加新语言

```
以zh为基础，添加zh等其他语言的国际化目录及翻译，翻译时关键词Speakami不改变，{name}、{{name}}这样的结构不改变​，参考大小写
```
