# ADHDer Web App - Railway Deployment

这是 ADHDer 应用的独立部署版本，专门为 Railway 平台优化。

## 🚀 部署到 Railway

### 方法 1：直接部署这个目录
1. 在 Railway 中创建新项目
2. 选择 "Deploy from GitHub repo"
3. 选择这个 `railway-deploy` 目录作为根目录
4. 配置环境变量（见下方）
5. 点击 Deploy

### 方法 2：创建新的 GitHub 仓库
1. 将这个 `railway-deploy` 目录推送到新的 GitHub 仓库
2. 在 Railway 中连接这个新仓库
3. 配置环境变量
4. 部署

## 🔧 环境变量配置

在 Railway 项目设置中添加：

```
DATABASE_URL=postgresql://neondb_owner:npg_svEAJiOB41ZR@ep-late-forest-a1clkrf8-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

可选：
```
RESEND_API_KEY=你的Resend API密钥
JWT_SECRET=你的JWT密钥
CLARITY_PROJECT_ID=你的Microsoft Clarity项目ID
```

## 📁 项目结构

```
railway-deploy/
├── app/                 # Next.js 应用目录
├── lib/                 # 工具库
├── prisma/              # 数据库 schema
├── packages/            # 共享包
├── package.json         # 依赖配置
├── Dockerfile          # Docker 配置
└── README.md           # 说明文档
```

## 🔄 构建流程

1. 安装 Node.js 依赖
2. 生成 Prisma 客户端
3. 构建 Next.js 应用
4. 启动生产服务器

## 📱 移动端配置

部署成功后，更新移动端的 API 地址：

```bash
export EXPO_PUBLIC_API_BASE="https://你的railway域名.up.railway.app"
```
