#!/bin/bash

# ADHDer Web App 部署脚本
# 支持多个平台：Render, Fly.io, Railway

set -e

echo "🚀 ADHDer Web App 部署脚本"
echo "================================"

# 检查参数
if [ $# -eq 0 ]; then
    echo "用法: ./deploy.sh [render|netlify|fly|railway]"
    echo ""
    echo "平台选择:"
    echo "  render   - 部署到 Render (免费，网页部署)"
    echo "  netlify  - 部署到 Netlify (免费，命令行部署)"
    echo "  fly      - 部署到 Fly.io (需要信用卡)"
    echo "  railway  - 部署到 Railway (命令行部署)"
    exit 1
fi

PLATFORM=$1

case $PLATFORM in
    "render")
        echo "📋 Render 部署说明:"
        echo "1. 访问 https://render.com"
        echo "2. 登录 GitHub 账号"
        echo "3. 点击 'New' → 'Web Service'"
        echo "4. 选择仓库: YALING0327/ADHDer-Web-Deploy"
        echo "5. 配置设置:"
        echo "   - Build Command: npm install && npm run build"
        echo "   - Start Command: npm start"
        echo "   - Environment Variables:"
        echo "     DATABASE_URL=你的数据库连接串"
        echo "6. 点击 'Create Web Service'"
        echo ""
        echo "✅ Render 部署完成！"
        ;;
        
    "netlify")
        echo "🌐 部署到 Netlify..."
        
        # 检查 netlify CLI 是否安装
        if ! command -v netlify &> /dev/null; then
            echo "❌ Netlify CLI 未安装，正在安装..."
            npm install -g netlify-cli
        fi
        
        # 登录 Netlify
        echo "🔐 登录 Netlify..."
        netlify login
        
        # 初始化站点
        echo "🚀 初始化站点..."
        netlify init
        
        # 设置环境变量
        echo "⚙️ 设置环境变量..."
        netlify env:set DATABASE_URL "postgresql://neondb_owner:npg_svEAJiOB41ZR@ep-late-forest-a1clkrf8-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
        
        # 部署
        echo "🚀 开始部署..."
        netlify deploy --prod
        
        echo "✅ Netlify 部署完成！"
        ;;
        
    "fly")
        echo "🛫 部署到 Fly.io..."
        
        # 检查 flyctl 是否安装
        if ! command -v fly &> /dev/null; then
            echo "❌ flyctl 未安装，正在安装..."
            curl -L https://fly.io/install.sh | sh
            export PATH="$PATH:$HOME/.fly/bin"
        fi
        
        # 登录 Fly.io
        echo "🔐 登录 Fly.io..."
        fly auth login
        
        # 初始化应用
        echo "🚀 初始化应用..."
        fly launch --no-deploy
        
        # 设置环境变量
        echo "⚙️ 设置环境变量..."
        fly secrets set DATABASE_URL="postgresql://neondb_owner:npg_svEAJiOB41ZR@ep-late-forest-a1clkrf8-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
        
        # 部署
        echo "🚀 开始部署..."
        fly deploy
        
        echo "✅ Fly.io 部署完成！"
        ;;
        
    "railway")
        echo "🚂 部署到 Railway..."
        
        # 检查 railway CLI 是否安装
        if ! command -v railway &> /dev/null; then
            echo "❌ Railway CLI 未安装，正在安装..."
            npm install -g @railway/cli
        fi
        
        # 登录 Railway
        echo "🔐 登录 Railway..."
        railway login
        
        # 链接项目
        echo "🔗 链接项目..."
        railway link
        
        # 设置环境变量
        echo "⚙️ 设置环境变量..."
        railway variables set DATABASE_URL="postgresql://neondb_owner:npg_svEAJiOB41ZR@ep-late-forest-a1clkrf8-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
        
        # 部署
        echo "🚀 开始部署..."
        railway up
        
        echo "✅ Railway 部署完成！"
        ;;
        
    *)
        echo "❌ 不支持的平台: $PLATFORM"
        echo "支持的平台: render, fly, railway"
        exit 1
        ;;
esac

echo ""
echo "🎉 部署完成！"
echo "📱 记得更新移动端的 API 地址"
