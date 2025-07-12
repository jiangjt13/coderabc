# CoderABC

## 部署到 Cloudflare Pages

### 构建设置

- **构建命令**: `npm run build`
- **构建输出目录**: `out`
- **Node.js 版本**: 18.x

### 部署步骤

1. **连接 Git 仓库**
   - 将代码推送到 GitHub/GitLab
   - 在 Cloudflare Pages 中连接仓库

2. **配置构建设置**
   ```
   构建命令: npm run build
   输出目录: out
   环境变量: NODE_VERSION=18
   ```

3. **自定义域名（可选）**
   - 在 Cloudflare Pages 设置中添加自定义域名
   - 配置 DNS 记录

### 本地开发

```bash
npm install
npm run dev
```

### 本地构建测试

```bash
npm run build
npx serve out
```

## 功能特色

- 🛠 **在线工具**: IP查询、JSON工具等实用开发工具
- 📝 **技术笔记**: 命令行工具学习指南（awk、sed、jq、curl等）
- 🌍 **多语言支持**: 中文/英文双语界面
- 🎨 **现代化UI**: 响应式设计，支持深色模式
- ⚡ **静态部署**: 基于 Next.js 静态导出，部署简单快速

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide React Icons
