# 构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 设置淘宝 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com


# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

# 复制源代码
COPY . .

ENV NEXT_PUBLIC_API_BASE_URL=https://chat-api.ioa.tech

# 构建应用
RUN pnpm build

# 生产阶段
FROM node:20-alpine AS runner
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

ENV NODE_ENV production
ENV PORT 3001

# 复制构建产物和必要文件
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["node", "server.js"] 