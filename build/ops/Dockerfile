# 第一阶段：依赖安装
FROM swr.cn-north-4.myhuaweicloud.com/global/node:22.13.1 as front


WORKDIR /app

# 复制包管理文件以利用缓存
COPY package.json pnpm-lock.yaml .npmrc ./

# 安装pnpm并设置镜像源
RUN npm install -g pnpm@9.6.0 && \
    pnpm config set registry https://registry.npmmirror.com/
# 安装项目依赖
RUN pnpm config set parallelDownloads 8
RUN pnpm install --frozen-lockfile

# 复制源代码(放在后面以最大化利用缓存)
COPY . .

# 构建项目
RUN pnpm run build:dev

# 第二阶段：运行时镜像
FROM swr.cn-north-4.myhuaweicloud.com/global/node:22.13.1-alpine as run

WORKDIR /app
COPY --from=front  /app/.next/standalone ./
COPY --from=front  /app/.next/static ./.next/static
COPY --from=front  /app/public ./public


ENV PORT 80
EXPOSE 80
CMD ["node", "server.js"]
