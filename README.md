# ADHDer Web App - Render 部署

这是 ADHDer 应用的独立部署版本，专门为 Render 平台优化。

## 🚀 快速部署到 Render

### 步骤 1：创建 GitHub 仓库
1. 在 GitHub 创建新仓库：`ADHDer-Web-Deploy`
2. 将 `adhder-render-deploy` 目录的内容推送到新仓库

### 步骤 2：在 Render 部署
1. 访问 https://render.com
2. 使用 GitHub 账号登录
3. 点击 "New" → "Web Service"
4. 选择你的 `ADHDer-Web-Deploy` 仓库
5. 配置以下设置：

#### 基本设置
- **Name**: `adhder-web`
- **Branch**: `main`
- **Root Directory**: `/` (保持默认)

#### 构建设置
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

#### 环境变量
添加以下环境变量：
```
DATABASE_URL=postgresql://neondb_owner:npg_svEAJiOB41ZR@ep-late-forest-a1clkrf8-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

可选环境变量：
```
JWT_SECRET=your-jwt-secret-here
RESEND_API_KEY=your-resend-key-here
CLARITY_PROJECT_ID=your-clarity-id-here
```

### 步骤 3：部署
1. 点击 "Create Web Service"
2. 等待构建完成（约 3-5 分钟）
3. 获取部署 URL

## 📱 移动端配置

部署成功后，更新移动端的 API 地址：

```bash
export EXPO_PUBLIC_API_BASE="https://你的render域名.onrender.com"
```

## 🔄 自动部署

每次推送到 GitHub 的 `main` 分支，Render 会自动重新部署。

## 💰 成本

- **免费层**：完全免费，无时间限制
- **付费层**：$7/月（无休眠限制）

## 🎯 优势

- ✅ **完全免费** - 免费层功能完整
- ✅ **自动部署** - GitHub 推送自动部署
- ✅ **HTTPS 自动** - 自动 SSL 证书
- ✅ **简单配置** - 无需复杂设置