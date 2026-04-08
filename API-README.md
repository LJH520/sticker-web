# API 客户端使用指南

本项目使用**Fetch + Axios 混合架构**，通过 `customFetch` 参数在客户端和服务端注入不同的实现。客户端使用 Axios（通过适配器转换），服务端使用原生 Fetch。所有 API 方法通过 `swagger-typescript-api` 从 OpenAPI/Swagger 规范自动生成，保证类型安全。

## 📋 目录

- [快速开始](#快速开始)
- [核心特性](#核心特性)
- [使用方式](#使用方式)
- [API 架构](#api-架构)
- [错误处理](#错误处理)
- [高级用法](#高级用法)
- [API 生成](#api-生成)
- [常见问题](#常见问题)

---

## 🚀 快速开始

### 1. 生成 API 客户端

```bash
pnpm api:generate
```

### 2. 在 React 组件中使用

```typescript
'use client';
import { clientApi } from '@/api/client-api';

export function MyComponent() {
  const handleClick = async () => {
    const res = await clientApi.login1({ authCode: '1', phoneCode: '123' });

    if (res.data.code === 0) {
      console.log('成功:', res.data.data);
    } else {
      console.log('失败:', res.data.msg);
      // Toast 已自动显示
    }
  };

  return <button onClick={handleClick}>登录</button>;
}
```

### 3. 在 Zustand Store 中使用

```typescript
import { create } from 'zustand';
import { clientApi } from '@/api/client-api';

export const useStore = create((set) => ({
  data: null,

  fetchData: async () => {
    const res = await clientApi.getUserInfo({});
    if (res.data.code === 0) {
      set({ data: res.data.data });
    }
  },
}));
```

### 4. 在服务端组件中使用

```typescript
import { serverApi } from '@/api/server-api';

export default async function Page() {
  // 🎉 使用 Proxy，直接调用！
  const res = await serverApi.getUserInfo(
    { id: '123' },
    {
      cache: 'force-cache',
      next: { revalidate: 60 }
    }
  );

  return <div>{res.data.data?.name}</div>;
}
```

---

## ✨ 核心特性

### 1. **Fetch + Axios 混合架构**

只维护一套基于 Fetch 的 API 代码，通过 `customFetch` 参数实现客户端和服务端的差异化处理：

```typescript
// 客户端：使用 Axios（通过适配器转换为 Fetch Response）
//         - 成熟的拦截器机制
//         - 自动错误处理
//         - 从 URL 解析 locale
//         - 自动添加 token

// 服务端：使用原生 Fetch
//         - Next.js 优化（缓存、ISR）
//         - 从参数传递 locale

const config = createHttpClient(isServer);
```

### 2. **无需 try-catch**

默认不抛出异常，失败时返回错误响应：

```typescript
// ✅ 简洁的错误处理
const res = await clientApi.getData();
if (res.data.code === 0) {
  // 成功
} else {
  // 失败（toast 已显示）
}
```

### 3. **自动 Toast 提示**

配置 `showToast` 参数控制提示：

```typescript
const res = await clientApi.updateUser(
  { name: 'John' },
  { showToast: true }  // 自动显示成功/失败提示
);
```

### 4. **Locale 自动获取**

从 URL 路径自动解析语言（`/en/...` → `'en'`），无需手动传递：

```typescript
// URL: /zh/dashboard
const res = await clientApi.xxx();
// 自动在请求头添加 x-locale: zh
```

### 5. **全局单例模式**

客户端所有组件共享同一个 API 实例，高效且节省内存。服务端使用 React.cache() 进行请求级缓存。

---

## 📦 使用方式

### 客户端组件

#### 方式 1: 直接实例 （推荐）

```typescript
import { clientApi } from '@/api/client-api';

// 在事件处理器或工具函数中
await clientApi.getData();
```

### 服务端组件

```typescript
import { serverApi } from '@/api/server-api';

export default async function Page() {
  // 直接调用，无需 await serverApi() 获取实例
  const res = await serverApi.getData(
    {},
    {
      cache: 'force-cache',       // Next.js 缓存
      next: { revalidate: 60 },   // ISR
    }
  );
}
```

### Zustand Store

```typescript
import { clientApi } from '@/api/client-api';

export const useAuthStore = create((set) => ({
  login: async (username, password) => {
    const res = await clientApi.login({ username, password });
    if (res.data.code === 0) {
      set({ user: res.data.data });
      return true;
    }
    return false;
  },
}));
```

### 工具函数

```typescript
// utils/api.ts
import { clientApi } from '@/api/client-api';

export async function fetchUserData(userId: string) {
  const res = await clientApi.getUserInfo({ id: userId });
  return res.data.code === 0 ? res.data.data : null;
}
```

---

## 🏗 API 架构

### 文件结构

```
api/
├── generated/
│   └── Api.ts                  # 统一的 Fetch API
├── client-api.ts               # 客户端 API 封装
├── server-api.ts               # 服务端 API 封装
└── index.ts                    # 统一导出

lib/
├── http-client-factory.ts      # 统一 HTTP 客户端工厂
└── axios-fetch-adapter.ts      # Axios 到 Fetch 的适配器

types/
├── fetch.d.ts                  # RequestInit 类型扩展
└── axios.d.ts                  # AxiosRequestConfig 类型扩展

scripts/
└── generate-api.mjs            # API 生成脚本

api-templates/                  # Fetch 模板
└── http-client.ejs

i18n/
└── config.ts                   # Locale 配置（getUserLocale）
```

### 统一架构原理

#### 客户端：Axios 适配器

```typescript
// lib/axios-fetch-adapter.ts
class AxiosFetchAdapter {
  // 1. 创建Axios实例
  private axiosInstance = axios.create({...});

  // 2. 配置拦截器（添加locale、token、错误处理）
  setupInterceptors();

  // 3. 将Axios响应转换为Fetch Response
  createFetchCompatible(): typeof fetch {
    return async (url, init) => {
      const axiosResponse = await this.axiosInstance.request(...);
      return new Response(JSON.stringify(axiosResponse.data), {...});
    };
  }
}

// lib/http-client-factory.ts (客户端)
function createClientHttpClient() {
  const adapter = new AxiosFetchAdapter({...});
  setupAxiosInterceptors(adapter.getAxiosInstance(), locale);

  return {
    customFetch: adapter.createFetchCompatible()
  };
}
```

#### 服务端：原生 Fetch

```typescript
// lib/http-client-factory.ts (服务端)
function createServerHttpClient() {
  const customFetch = async (...args: Parameters<typeof fetch>) => {
    // 1. 获取 locale（从参数传入）
    const locale = init?._locale || 'en';

    // 2. 构建 headers
    const headers = { 'x-locale': locale };

    // 3. 发送请求
    const response = await fetch(url, { ...init, headers });

    // 4. 错误处理
    if (!response.ok) {
      if (showToast) showToast(errorMessage);
      if (!rejectOnError) return wrappedErrorResponse;
    }

    return response;
  };

  return { customFetch };
}
```

### 单例模式实现

#### 客户端（全局单例）

```typescript
// api/client-api.ts
let globalApiInstance: ApiMethods | null = null;

function getOrCreateApiInstance(): ApiMethods {
  if (globalApiInstance) return globalApiInstance;

  const config = createHttpClient(false); // 客户端配置
  const instance = new Api(config);
  globalApiInstance = instance.api;
  return globalApiInstance;
}
```

#### 服务端（请求级缓存）

```typescript
// api/server-api.ts
const getCachedApiInstance = cache((locale: string): ApiMethods => {
  const config = createHttpClient(true); // 服务端配置
  const instance = new Api(config);

  // 包装方法以传递 locale
  return wrapApiWithLocale(instance.api, locale);
});

export async function serverApi() {
  const locale = await getLocale();
  return getCachedApiInstance(locale);
}
```

---

## ⚠️ 错误处理

### 默认行为（无需 try-catch）

```typescript
const res = await clientApi.updateUser({ name: 'John' });

if (res.data.code === 0) {
  // 成功
  const user = res.data.data;
} else {
  // 失败
  const error = res.data.msg;
  // Toast 已自动显示
}
```

### 配置选项

```typescript
await clientApi.updateUser(
  { name: 'John' },
  {
    showToast: true,        // 显示 toast（默认: true）
    rejectOnError: false,   // 失败时不抛异常（默认: false）
  }
);
```

### 抛出异常模式

如果需要 try-catch：

```typescript
try {
  const res = await clientApi.updateUser(
    { name: 'John' },
    { rejectOnError: true }  // 失败时抛异常
  );
  console.log('成功', res.data);
} catch (error) {
  console.error('失败', error);
}
```

---

## 🎨 高级用法

### 自定义请求配置

```typescript
const res = await clientApi.getData(
  { id: '123' },
  {
    showToast: false,
    rejectOnError: false,
    cache: 'no-store',
    headers: {
      'X-Custom-Header': 'value'
    },
  }
);
```

### 服务端 Next.js Fetch 配置

```typescript
const res = await serverApi.getData(
  { id: '123' },
  {
    cache: 'no-store',
    next: {
      revalidate: 60,
      tags: ['users'],
    },
  }
);
```

### 语言切换处理

#### 方式 1: 页面刷新（推荐）

```typescript
function changeLanguage(newLocale: string) {
  const currentPath = window.location.pathname;
  const newPath = currentPath.replace(/^\/[a-z]{2}\//, `/${newLocale}/`);

  // 刷新页面，自动重新创建实例
  window.location.href = newPath;
}
```

#### 方式 2: 清除缓存（SPA 导航）

```typescript
import { clearApiCache } from '@/api/client-api';

function changeLanguage(newLocale: string) {
  clearApiCache(); // 清除旧实例
  router.push(`/${newLocale}/dashboard`);
}
```

---

## 🔧 API 生成

### 生成命令

```bash
pnpm api:generate
```

输出：
```
🚀 Starting API generation...
✅ API generated successfully!

Generated files:
  📄 api/generated/Api.ts
```

### 配置

编辑 `scripts/generate-api.mjs`：

```javascript
const API_URL = 'https://your-api.com/v3/api-docs';
const OUTPUT_DIR = './api/generated';
```

---

## 📚 导出说明

| 导出 | 类型 | 使用场景 | 示例 |
|------|------|---------|------|
| `clientApi` | 实例 | 任何客户端环境 | `await clientApi.getData()` |
| `serverApi` | Proxy | 服务端组件 | `await serverApi.getData()` |
| `clearApiCache` | 函数 | 清除缓存 | `clearApiCache()` |

### 完整导出列表

```typescript
// 推荐使用（简化名称）
export { clientApi } from '@/api';        // 实例
export { serverApi } from '@/api';        // 函数

// 完整名称（向后兼容）
export { createClientApi } from '@/api';  // 创建客户端实例
export { createServerApi } from '@/api';  // 等同于 serverApi

// 工具函数
export { clearApiCache } from '@/api';
```

---

## 🎯 使用场景对照表

| 场景 | 推荐方式 | 代码示例 |
|------|---------|---------||
| React 组件 | `clientApi` | `await clientApi.login()` |
| Zustand Store | `clientApi` | `await clientApi.login()` |
| 工具函数（客户端） | `clientApi` | `await clientApi.getData()` |
| 事件处理器 | `clientApi` | `onClick={() => clientApi.send()}` |
| 服务端组件 | `serverApi` | `await serverApi.getData()` |
| Server Actions | `serverApi` | `await serverApi.updateUser()` |

---

## 💡 常见问题

### Q: 为什么不需要 try-catch？

A: 默认配置 `rejectOnError: false`，失败时返回错误响应而不抛异常，使代码更简洁。

### Q: Toast 提示如何自定义？

A: 修改 `lib/http-client-factory.ts` 中的 `showToast` 函数，集成你的 toast 库（如 sonner、react-toastify）。

### Q: 如何指定特定的 locale？

A: Locale 从 URL 自动获取（`getUserLocale()` 从路径解析）。服务端通过 `_locale` 参数传递。

### Q: 为什么使用 Fetch + Axios 混合架构？

A:
- ✅ 只维护一套生成代码（Fetch API）
- ✅ 统一的类型定义
- ✅ 客户端使用 Axios 的成熟拦截器和错误处理
- ✅ 服务端使用原生 Fetch，享受 Next.js 优化
- ✅ 各取所长，最佳性能

### Q: Axios 适配器如何工作？

A: Axios 适配器将 Axios 的响应转换为 Fetch Response 格式，使得生成的 Fetch API 可以无缝使用 Axios：
```typescript
// Axios响应 → Fetch Response
new Response(JSON.stringify(axiosResponse.data), {
  status: axiosResponse.status,
  statusText: axiosResponse.statusText,
  headers: new Headers(axiosResponse.headers)
})
```

### Q: 客户端和服务端有什么区别？

A:
- **客户端**: 使用 Axios（通过适配器），从 URL 解析 locale，自动添加 localStorage token，成熟的拦截器机制
- **服务端**: 使用原生 Fetch，从参数传递 locale，不访问 localStorage，享受 Next.js 优化（缓存、ISR）

### Q: API 更新后需要做什么？

A: 运行 `pnpm api:generate` 重新生成客户端代码。

---

## 📝 完整示例

### 登录流程

```typescript
'use client';
import { clientApi } from '@/api/client-api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await clientApi.login(
      {
        username: formData.get('username') as string,
        password: formData.get('password') as string,
      },
      {
        showToast: true,
      }
    );

    setLoading(false);

    if (res.data.code === 0) {
      localStorage.setItem('token', res.data.data.token);
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  );
}
```

---

## ⚙️ 环境要求

- Node.js >= 18
- pnpm
- TypeScript >= 5

---

## 🚨 注意事项

⚠️ **重要提示：**

1. ✅ 首次使用前必须运行 `pnpm api:generate`
2. ✅ API 更新后需要重新生成代码
3. ❌ 不要手动修改 `api/generated/` 目录中的代码
4. ✅ 所有请求自动包含 `x-locale` 请求头
5. ✅ 客户端组件需要使用 `'use client'` 指令
6. ✅ Locale 从 URL 自动解析，无需手动传递
7. ✅ 客户端使用 Axios（成熟拦截器），服务端使用原生 Fetch（Next.js 优化）
8. ✅ 只生成一套 Fetch API，通过适配器实现双 HTTP 客户端

---

## 🚀 开始使用

1. **生成 API**
   ```bash
   pnpm api:generate
   ```

2. **在组件中使用**
   ```typescript
   import { clientApi } from '@/api/client-api';
   const res = await clientApi.getData();
   ```

3. **处理响应**
   ```typescript
   if (res.data.code === 0) {
     // 成功
   }
   ```

就是这么简单！🎉
