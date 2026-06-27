# opc-x 项目脚手架 — 避坑指南

## 坑点总结（血泪教训）

### 1. DATABASE_URL 在 Vercel 生产环境是空字符串
Vercel-Neon 集成只自动填了 `DATABASE_URL_UNPOOLED`（直连端点），`DATABASE_URL`（pooler）为空。
**永远用 `DATABASE_URL_UNPOOLED`，不要用 `DATABASE_URL`。**

### 2. `channel_binding=require` 让 neon() HTTP 驱动 fetch 崩
Neon 连接串的 `?channel_binding=require&sslmode=require` 在 neon() 构造 HTTP URL 时出错。
**必须 `.split("?")[0]` 去掉 query 参数。**

### 3. 生产库和开发库是两个不同 Neon 数据库
`drizzle-kit push` 默认打本地 `.env.local`，生产库没表。
**每次新项目，要单独对生产库跑一次 `drizzle-kit push`。**

### 4. Neon pooler 端点的 HTTP SQL API 不可用
`ep-XXX-pooler.c-3.us-east-1.aws.neon.tech` 这个 hostname 不支持 HTTP SQL 协议，只支持 TCP pgbouncer。
直连端点（`ep-XXX.c-3.us-east-1.aws.neon.tech`，无 `-pooler`）才支持 HTTP API。

### 5. Next.js 版本需 ≥ 16.2.9
Vercel 会 block 低版本（安全漏洞），升级到 16.2.9 解决。

---

## 新项目一键流程

```bash
# 1. 克隆或 fork 脚手架
git clone https://github.com/opc-x/portal new-project
cd new-project

# 2. 配置 .env.local（从 Vercel dashboard 或 neonctl 拿）
echo 'DATABASE_URL_UNPOOLED="postgresql://...direct-endpoint.../dbname"' > .env.local

# 3. 建表
npm run db:push

# 4. 部署
vercel deploy --prod

# 5. 配 Vercel 生产 env var
vercel env add DATABASE_URL_UNPOOLED production
# 粘贴 DATABASE_URL_UNPOOLED 值（直连端点，不要 pooler）

# 6. 对生产库建表
DATABASE_URL_UNPOOLED="<prod-direct-url>" npm run db:push
```

---

## 关键文件

| 文件 | 说明 |
|------|------|
| `lib/db/index.ts` | 正确的 Neon HTTP 驱动写法 |
| `drizzle.config.ts` | drizzle-kit 配置，优先用 UNPOOLED |
| `lib/db/schema.ts` | 数据库 schema 定义 |
