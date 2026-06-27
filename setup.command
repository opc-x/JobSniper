#!/bin/bash
set -e

echo "=== JobSniper Setup ==="
cd ~/Projects/JobSniper

# Git identity
git config user.email "trump@dc66.net"
git config user.name "Trump"

# Commit if not already committed
if ! git log --oneline -1 &>/dev/null; then
  git add .
  git commit -m "feat: init JobSniper — Next.js 15 + Neon + PWA + Server Actions"
  echo "✓ 初始提交完成"
else
  git add .
  git diff --cached --quiet || git commit -m "feat: update nav + match page"
  echo "✓ 已有提交，更新提交完成"
fi

# GitHub
if gh repo view JobSniper &>/dev/null 2>&1; then
  echo "✓ GitHub repo 已存在，直接 push"
  git push origin main 2>/dev/null || git push origin master 2>/dev/null || true
else
  echo "→ 创建 GitHub repo..."
  gh repo create JobSniper --public --source=. --remote=origin --push
  echo "✓ GitHub repo 创建并推送完成"
fi

# npm install
echo "→ npm install..."
npm install
echo "✓ 依赖安装完成"

# Vercel CLI
if ! command -v vercel &>/dev/null; then
  echo "→ 安装 Vercel CLI..."
  npm install -g vercel
fi

echo ""
echo "=============================="
echo "✅ 脚本执行完毕"
echo "接下来需要："
echo "  1. 去 Neon 拿 DATABASE_URL 写入 .env.local"
echo "  2. 运行: npm run db:push"
echo "  3. 运行: vercel --prod  (会引导登录和部署)"
echo "=============================="
