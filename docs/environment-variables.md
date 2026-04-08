# 环境变量配置说明

## 文件说明

项目使用以下环境变量文件：

1. **.env** - 基础环境变量，所有环境共享（已提交到 Git）
2. **.env.local** - 本地开发环境变量（不提交到 Git）
3. **.env.production** - 生产环境变量（不提交到 Git）
4. **.env.example** - 环境变量示例文件（提交到 Git）

## 优先级

Next.js 按以下优先级加载环境变量：

1. `.env.local` (优先级最高)
2. `.env.[environment]` (如 `.env.production`)
3. `.env` (基础配置)

## 配置方式

### 1. 在 next.config.ts 中加载

```typescript
import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
```

### 2. 使用 cross-env 设置环境变量

在 package.json 的 scripts 中：

```json
{
  "scripts": {
    "dev": "cross-env APP_ENV=development next dev",
    "build": "cross-env APP_ENV=production next build",
    "build:staging": "cross-env APP_ENV=staging next build"
  }
}
```

## 环境变量命名规范

### 服务器端变量
```bash
# 仅在服务器端可用
APP_ENV=development
APP_URL=http://localhost:3000
API_URL=https://api.example.com
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key
```

### 客户端变量
```bash
# 使用 NEXT_PUBLIC_ 前缀，可在浏览器中访问
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_AUTH_ENABLED=true
```

## 使用方式

### 在代码中访问环境变量

#### 服务器端（推荐通过 constants）
```typescript
// constants/index.tsx
export const APP_ENV = process.env.APP_ENV;
export const APP_BASE_URL = process.env.APP_URL;
export const APP_API_BASE_URL = process.env.API_URL;

// 在其他文件中使用
import { APP_BASE_URL } from '@/constants';
```

#### 客户端
```typescript
// 在组件中直接访问
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## 初始化项目

1. 复制示例文件：
```bash
cp .env.example .env.local
```

2. 填写本地开发所需的环境变量

3. 启动开发服务器：
```bash
pnpm dev
```

## 注意事项

⚠️ **安全提示：**
- 永远不要将包含敏感信息的 `.env.local` 或 `.env.production` 提交到 Git
- 只有 `NEXT_PUBLIC_` 前缀的变量会暴露给浏览器
- 敏感密钥（如 API keys、数据库密码）不要使用 `NEXT_PUBLIC_` 前缀
- 在生产环境中，通过部署平台的环境变量管理系统配置变量
