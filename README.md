# MF Video Studio

> 灵犀 AI 视频生成工作台 —— 基于 TanStack Start 的全栈 React 应用。

## 项目简介

MF Video Studio 是一个面向 AI 视频创作的 Web 工作台，包含：

- 智能创作首页与 Prompt 输入框
- 快速生成、脚本视频、画布、Skill、Creative Assistant 等创作流程
- 灵感发现（Artrail TV）、创作课程、精选作品
- 团队 / 预算 / 订阅 / 积分 / 账户设置

## 技术栈

- **框架**: [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7)
- **路由**: TanStack Router（基于文件的路由）
- **样式**: Tailwind CSS v4 + CSS 主题变量
- **组件**: shadcn/ui
- **语言**: TypeScript
- **包管理**: Bun（兼容 npm）
- **运行时目标**: Edge / Cloudflare Workers

## 本地运行

### 1. 克隆仓库

```sh
git clone https://github.com/dzystyle/mf-visual-studio.git
cd mf-visual-studio
```

### 2. 安装依赖

推荐使用 Bun：

```sh
bun install
```

如果你没有安装 Bun，也可以用 npm：

```sh
npm install
```

### 3. 启动开发服务器

```sh
bun dev
```

或：

```sh
npm run dev
```

默认开发服务器地址为 `http://localhost:8080`。

### 4. 构建（可选）

```sh
bun run build
```

## 环境变量

项目使用 `import.meta.env.VITE_*` 读取浏览器端配置，服务端配置通过 `process.env` 在 server functions 中读取。

本地开发时，如需连接后端服务，可在项目根目录创建 `.env.local`（不会被提交），例如：

```sh
VITE_APP_NAME=MF Video Studio
```

> 注意：不要提交包含 API 密钥、数据库连接字符串等敏感信息的 `.env` 文件。

## 项目结构

```text
src/
  components/      # 可复用组件与页面级组件
  hooks/           # 自定义 React Hooks
  lib/             # 工具函数与业务逻辑
  routes/          # TanStack Router 路由页面
  server.ts        # 服务端入口配置
  start.ts         # 应用启动配置
  styles.css       # 全局样式与 Tailwind v4 主题变量
public/            # 静态资源
```

## 同步说明

本仓库代码已从 Lovable 推送到 GitHub。后续如需继续双向同步，可在 Lovable 编辑器中通过 **GitHub → Connect project** 连接本仓库；当前一次性推送完成后，你也可以在本地修改并 `git push` 到 `main` 分支。

## 许可证

项目代码归仓库所有者所有。
