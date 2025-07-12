# ToolsABC

**访问地址**：[redherringai.com](https://redherringai.com)

## 📌 项目简介

**ToolsABC** 是一个面向开发者和技术爱好者的在线工具与知识笔记集合网站，致力于提供高效、实用、简洁的在线服务。  
项目基于 **Next.js + React + TailwindCSS** 构建，支持深浅主题切换，并通过 **Cloudflare Pages** 实现快速部署与全球访问优化。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看网站。

### 构建项目

```bash
npm run build
```

## 🧭 网站结构

### 顶部导航栏

- **Tools**（下拉菜单）
  - **IP Tools**：查询 IP 地址信息，支持转换、定位等功能。
  - **JSON Tools**：格式化、验证 JSON 数据，支持压缩与美化。
  
- **Notes**（下拉菜单）
  - **jq**：轻量级命令行 JSON 处理工具。
  - **curl**：数据传输命令行工具。
  - **sed**：流编辑器，适用于文本数据的查找与替换。
  - **awk**：功能强大的文本与数据处理工具。

- **About**：关于本项目的介绍与开发背景。

## 🛠 技术栈

| 技术            | 用途                                      |
|-----------------|-------------------------------------------|
| **Next.js**     | React 框架，用于服务端渲染和静态生成     |
| **React**       | 构建用户界面                              |
| **TailwindCSS** | 响应式 UI 设计，支持暗/明主题切换         |
| **TypeScript**  | 类型安全的JavaScript                      |
| **Lucide React**| 现代化的图标库                            |

## 🌙 特色功能

- 明暗主题切换，自动识别系统设置
- 响应式设计，适配移动与桌面设备
- 易于扩展的工具与笔记结构
- 现代化的用户界面设计

## 🚀 部署说明

### Cloudflare Pages 部署

1. 将项目推送至 GitHub
2. 登录 [Cloudflare Pages](https://pages.cloudflare.com/) 并连接 GitHub 仓库
3. 配置构建设置：
   - **Framework preset**：Next.js
   - **Build command**：`npm run build`
   - **Output directory**：`out`
4. 绑定自定义域名
5. 完成部署并启用自动持续集成

### 其他平台部署

项目支持部署到 Vercel、Netlify 等静态网站托管平台。

## 📂 项目结构

```
toolsabc/
├── src/
│   ├── app/                 # App Router 页面
│   │   ├── about/          # 关于页面
│   │   ├── notes/          # 笔记页面
│   │   │   ├── jq/
│   │   │   ├── curl/
│   │   │   ├── sed/
│   │   │   └── awk/
│   │   ├── tools/          # 工具页面
│   │   │   ├── ip/
│   │   │   └── json/
│   │   ├── layout.tsx      # 根布局
│   │   ├── page.tsx        # 首页
│   │   └── globals.css     # 全局样式
│   ├── components/         # React 组件
│   │   ├── navbar.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   └── lib/               # 工具函数
│       └── utils.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 📝 开发指南

### 添加新工具

1. 在 `src/app/tools/` 目录下创建新的工具页面
2. 更新导航栏菜单 (`src/components/navbar.tsx`)
3. 在首页添加工具卡片 (`src/app/page.tsx`)

### 添加新笔记

1. 在 `src/app/notes/` 目录下创建新的笔记页面
2. 更新导航栏菜单 (`src/components/navbar.tsx`)
3. 在首页添加笔记卡片 (`src/app/page.tsx`)

### 主题定制

主题配置在 `src/app/globals.css` 文件中，可以通过修改 CSS 变量来自定义颜色主题。

## 📂 未来计划

- 增加更多工具（如：Base64 编码/解码、时间戳转换、正则测试器等）
- 加入全文搜索功能
- 提供多语言版本（中英）
- 用户收藏功能
- 工具使用统计

## 🤝 贡献

欢迎任何形式的贡献！请查看我们的贡献指南。

## 📄 许可证

MIT License

---

欢迎任何建议与贡献！
