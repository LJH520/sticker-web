# API 客户端使用指南

本项目使用 `swagger-typescript-api` 自动生成类型安全的 API 客户端代码。

## 功能特性

- ✅ 基于 OpenAPI/Swagger 规范自动生成
- ✅ 完整的 TypeScript 类型支持
- ✅ 自动添加 `x-locale` 请求头
- ✅ 支持客户端组件和服务器组件
- ✅ 统一的错误处理
- ✅ 自动添加认证 token

## 生成 API 客户端

### 1. 运行生成命令

```bash
pnpm api:generate
```

这会从配置的 OpenAPI 规范 URL 生成 TypeScript API 客户端代码到 `src/api/generated/` 目录。

### 2. 更新 API URL (可选)

如果需要更改 OpenAPI 规范的来源，编辑 `scripts/generate-api.js`：

```javascript
const API_URL = 'https://your-api-domain.com/v3/api-docs';
```

## 客户端组件使用

### 基础用法

```typescript
'use client';

import { useApiClient } from '@/api';
import { useEffect, useState } from 'react';

export function MeetingList() {
  const api = useApiClient(); // 自动包含 x-locale 请求头
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      // 调用生成的 API 方法
      const response = await api.api.listMeetingRoom({
        current: 1,
        size: 10,
      });

      if (response.data.code === 0) {
        setMeetings(response.data.data?.records || []);
      }
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  // 创建会议
  const createMeeting = async (roomName: string) => {
    try {
      const response = await api.api.createMeetingRoom({
        roomName,
      });

      if (response.data.code === 0) {
        console.log('Meeting created:', response.data.data);
        fetchMeetings(); // 刷新列表
      }
    } catch (error) {
      console.error('Failed to create meeting:', error);
    }
  };

  // 删除会议
  const deleteMeeting = async (roomId: string) => {
    try {
      const response = await api.api.deleteMeetingRoom({ roomId });

      if (response.data.code === 0) {
        console.log('Meeting deleted');
        fetchMeetings(); // 刷新列表
      }
    } catch (error) {
      console.error('Failed to delete meeting:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Meetings</h2>
      <button onClick={() => createMeeting('New Meeting')}>
        Create Meeting
      </button>
      <ul>
        {meetings.map((meeting: any) => (
          <li key={meeting.roomId}>
            {meeting.roomName}
            <button onClick={() => deleteMeeting(meeting.roomId)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 使用自定义语言

```typescript
'use client';

import { createClientApi } from '@/api';

export function CustomLocaleComponent() {
  const zhApi = createClientApi('zh'); // 强制使用中文
  const enApi = createClientApi('en'); // 强制使用英文

  const fetchInChinese = async () => {
    const response = await zhApi.api.listMeetingRoom({ current: 1, size: 10 });
    return response.data;
  };

  return <div>...</div>;
}
```

## 服务器组件使用

### 基础用法

```typescript
import { createServerApi } from '@/api';

export default async function MeetingsPage() {
  // 自动获取当前语言并添加到 x-locale 请求头
  const api = await createServerApi();

  try {
    const response = await api.api.listMeetingRoom({
      current: 1,
      size: 20,
    });

    const meetings = response.data.data?.records || [];

    return (
      <div>
        <h1>Meetings</h1>
        <ul>
          {meetings.map((meeting) => (
            <li key={meeting.roomId}>
              <h3>{meeting.roomName}</h3>
              <p>Status: {meeting.roomStatus}</p>
              <p>Created: {new Date(meeting.createTime!).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    return <div>Failed to load meetings</div>;
  }
}
```

### Server Actions

```typescript
'use server';

import { createServerApi } from '@/api';
import { revalidatePath } from 'next/cache';

export async function createMeeting(formData: FormData) {
  const api = await createServerApi();

  try {
    const roomName = formData.get('roomName') as string;

    const response = await api.api.createMeetingRoom({ roomName });

    if (response.data.code === 0) {
      revalidatePath('/meetings');
      return { success: true, data: response.data.data };
    }

    return { success: false, error: response.data.msg };
  } catch (error) {
    return { success: false, error: 'Failed to create meeting' };
  }
}

export async function deleteMeeting(roomId: string) {
  const api = await createServerApi();

  try {
    const response = await api.api.deleteMeetingRoom({ roomId });

    if (response.data.code === 0) {
      revalidatePath('/meetings');
      return { success: true };
    }

    return { success: false, error: response.data.msg };
  } catch (error) {
    return { success: false, error: 'Failed to delete meeting' };
  }
}
```

使用 Server Actions：

```typescript
'use client';

import { createMeeting, deleteMeeting } from './actions';

export function MeetingForm() {
  return (
    <form action={createMeeting}>
      <input name="roomName" placeholder="Meeting Name" required />
      <button type="submit">Create Meeting</button>
    </form>
  );
}
```

### 使用自定义语言

```typescript
import { createServerApiWithLocale } from '@/api';

export async function getMeetingsForLocale(locale: string) {
  const api = createServerApiWithLocale(locale);

  const response = await api.api.listMeetingRoom({ current: 1, size: 10 });
  return response.data.data?.records;
}
```

## API 路由处理器

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerApiWithLocale } from '@/api';

export async function GET(request: NextRequest) {
  const locale = request.headers.get('x-locale') || 'en';
  const api = createServerApiWithLocale(locale);

  try {
    const response = await api.api.listMeetingRoom({
      current: 1,
      size: 10,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch meetings' },
      { status: 500 },
    );
  }
}
```

## 类型定义

所有类型都从生成的 API 文件中导出：

```typescript
import type {
  MeetingRoomInfoVO,
  CreateMeetingRoomParam,
  ListMeetingRoomParam,
  ResultWrapperPageResultWrapperMeetingRoomInfoVO,
} from '@/api';

// 使用类型
const meeting: MeetingRoomInfoVO = {
  roomId: '123',
  roomName: 'Test Meeting',
  roomStatus: 0,
};

const params: CreateMeetingRoomParam = {
  roomName: 'New Meeting',
};
```

## 自定义 Hook 示例

```typescript
'use client';

import { useApiClient } from '@/api';
import { useState } from 'react';
import type { MeetingRoomInfoVO, ListMeetingRoomParam } from '@/api';

export function useMeetings() {
  const api = useApiClient();
  const [meetings, setMeetings] = useState<MeetingRoomInfoVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = async (params: ListMeetingRoomParam = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.api.listMeetingRoom({
        current: 1,
        size: 10,
        ...params,
      });

      if (response.data.code === 0) {
        setMeetings(response.data.data?.records || []);
      } else {
        setError(response.data.msg || 'Unknown error');
      }
    } catch (err) {
      setError('Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (roomName: string) => {
    try {
      const response = await api.api.createMeetingRoom({ roomName });

      if (response.data.code === 0) {
        await fetchMeetings(); // 刷新列表
        return { success: true, data: response.data.data };
      }

      return { success: false, error: response.data.msg };
    } catch (err) {
      return { success: false, error: 'Failed to create meeting' };
    }
  };

  const deleteMeeting = async (roomId: string) => {
    try {
      const response = await api.api.deleteMeetingRoom({ roomId });

      if (response.data.code === 0) {
        await fetchMeetings(); // 刷新列表
        return { success: true };
      }

      return { success: false, error: response.data.msg };
    } catch (err) {
      return { success: false, error: 'Failed to delete meeting' };
    }
  };

  return {
    meetings,
    loading,
    error,
    fetchMeetings,
    createMeeting,
    deleteMeeting,
  };
}
```

使用自定义 Hook：

```typescript
'use client';

import { useMeetings } from '@/hooks/useMeetings';
import { useEffect } from 'react';

export function MeetingsList() {
  const { meetings, loading, error, fetchMeetings, createMeeting, deleteMeeting } = useMeetings();

  useEffect(() => {
    fetchMeetings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* render meetings */}
    </div>
  );
}
```

## 错误处理

```typescript
import { useApiClient } from '@/api';
import { AxiosError } from 'axios';

export function ErrorHandlingExample() {
  const api = useApiClient();

  const handleRequest = async () => {
    try {
      const response = await api.api.listMeetingRoom({ current: 1, size: 10 });

      // 检查业务逻辑错误
      if (response.data.code !== 0) {
        console.error('Business error:', response.data.msg);
        return;
      }

      // 处理成功响应
      console.log('Success:', response.data.data);
    } catch (error) {
      // 处理 HTTP 错误
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error('Server error:', error.response.status);
        } else if (error.request) {
          console.error('Network error');
        }
      }
    }
  };

  return <div>...</div>;
}
```

## 配置说明

### 修改 OpenAPI 源

编辑 `scripts/generate-api.js`：

```javascript
const API_URL = 'https://your-new-api.com/v3/api-docs';
```

### 修改输出目录

编辑 `scripts/generate-api.js`：

```javascript
const OUTPUT_DIR = path.resolve(process.cwd(), './src/api/generated');
```

### 自定义生成选项

在 `scripts/generate-api.js` 中调整 `generateApi` 的配置选项。

## 注意事项

⚠️ **重要提示：**

1. **首次使用前必须运行 `pnpm api:generate`**
2. **API 更新后需要重新生成代码**
3. **生成的代码在 `src/api/generated/` 目录，不要手动修改**
4. **所有请求自动包含 `x-locale` 请求头**
5. **客户端组件需要 `'use client'` 指令**
6. **token 仅在浏览器环境中添加**

## 常见问题

### Q: 如何处理分页？

```typescript
const fetchPage = async (page: number, pageSize: number) => {
  const response = await api.api.listMeetingRoom({
    current: page,
    size: pageSize,
  });

  return {
    items: response.data.data?.records || [],
    total: response.data.data?.total || 0,
    pages: response.data.data?.pages || 0,
  };
};
```

### Q: 如何添加自定义请求头？

```typescript
const response = await api.api.listMeetingRoom(
  { current: 1, size: 10 },
  {
    headers: {
      'Custom-Header': 'value',
    },
  },
);
```

### Q: 如何取消请求？

```typescript
import axios from 'axios';

const source = axios.CancelToken.source();

const response = await api.api.listMeetingRoom(
  { current: 1, size: 10 },
  {
    cancelToken: source.token,
  },
);

// 取消请求
source.cancel('Request cancelled');
```
