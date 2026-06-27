#!/bin/bash
# 对生产 Neon 数据库建表 — 新项目必跑
# 用法: DATABASE_URL_UNPOOLED="postgresql://..." ./scripts/setup-prod-db.sh

set -e

if [ -z "$DATABASE_URL_UNPOOLED" ]; then
  echo "ERROR: DATABASE_URL_UNPOOLED 未设置"
  echo "从 Vercel dashboard 或 'vercel env pull --environment=production' 获取"
  exit 1
fi

# 去掉 channel_binding=require 等参数
CLEAN_URL=$(echo "$DATABASE_URL_UNPOOLED" | cut -d'?' -f1)

echo "→ 连接到: $CLEAN_URL"
DATABASE_URL_UNPOOLED="$CLEAN_URL" npx drizzle-kit push --force
echo "✓ 生产库建表完成"
