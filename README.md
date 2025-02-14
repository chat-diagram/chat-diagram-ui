# Chat Diagram

Chat Diagram 是一个基于 AI 的图表生成工具,可以通过自然语言对话快速生成各类图表。

## 特性

- 💬 通过自然语言描述生成图表 ✅
- 📊 支持多种图表类型(流程图、时序图、架构图等) ✅
- 📁 项目管理 ✅
- 🔄 版本控制 ✅
- 📝 实时编辑和预览 ✅
- 🌓 明暗主题切换 ✅
- 🌐 i18n ✅
- 💰 会员权益 🚧
  - 💳 支付方式 🚧
    - 💸 支付宝 ✅
    - 💸 微信 🚧
  - ♾️ 无限版本 ✅
  - 🔄 无限增强描述 🚧
  - 🎨 高级图表样式 🚧
- 🎨 图表样式自定义 🚧
- 📤 支持多种导出 🚧
  - 📷 导出图表 🚧
  - 💾 数据库ER图支持导出为sql 🚧

## 技术栈

- 框架: Next.js 15
- UI: Tailwind CSS + shadcn/ui + Ant Design
- 状态管理: Zustand
- 数据获取: TanStack Query
- 图表引擎: Mermaid.js
- 代码编辑器: Monaco Editor

## 开始使用

1. 克隆项目
```bash
git clone https://github.com/yourusername/chat-diagram.git
cd chat-diagram
```
2. 安装依赖
```bash
pnpm install
```
3. 配置环境变量

复制 `.env.example` 文件并重命名为 `.env`:
```bash
cp .env.example .env
```
4. 启动开发环境
```bash
pnpm dev
```
访问 http://localhost:3001 查看应用。

## Docker 部署

1. 构建镜像
```bash
# 使用 buildx 构建多平台镜像
docker buildx create --name mybuilder --driver docker-container --bootstrap
docker buildx use mybuilder
docker buildx build --platform linux/amd64 -t yourusername/chat-diagram:latest --push .
```

2. 运行容器
```bash
docker run -d -p 3001:3001 yourusername/chat-diagram:latest
```

## 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | API 基础地址 | https://chat-api.ioa.tech |
| `PORT` | 应用运行端口 | 3001 |

## 贡献指南

欢迎提交 Pull Request 和 Issue！

## 许可证

本项目采用 [MIT 许可证](LICENSE)。


