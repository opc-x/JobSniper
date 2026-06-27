# JobSniper

精准狙击目标职位的求职工具 — 渠道打通 · 职位画像 · 匹配评分

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 15 (App Router) |
| 语言 | TypeScript strict |
| 样式 | Tailwind CSS v3 |
| DB | Neon (PostgreSQL serverless) via `@neondatabase/serverless` |
| ORM | Drizzle ORM |
| 服务端逻辑 | Server Actions (`"use server"`) |
| PWA | @ducanh2912/next-pwa |
| 部署 | Vercel |

## 目录结构

```
JobSniper/
├── app/                      # App Router 页面
│   ├── layout.tsx            # 根布局（含 BottomNav）
│   ├── page.tsx              # 首页 Dashboard
│   ├── jobs/
│   │   ├── page.tsx          # 职位列表
│   │   └── [id]/page.tsx     # 职位详情 + 匹配分析
│   ├── channels/page.tsx     # 渠道录入页
│   ├── profile/page.tsx      # 求职画像页
│   └── manifest.ts           # PWA manifest
├── lib/
│   ├── db/
│   │   ├── index.ts          # Neon + Drizzle 初始化
│   │   └── schema.ts         # 数据库 schema
│   ├── actions/              # Server Actions（接口锚点）
│   │   ├── jobs.ts           # addJob / getJobs / getJobById / updateJobStatus
│   │   ├── match.ts          # scoreJob / batchScore
│   │   └── profile.ts        # upsertProfile / getProfile
│   └── utils.ts              # cn / nanoid / scoreColor
├── components/
│   ├── ui/BottomNav.tsx      # 移动端底部导航
│   └── jobs/
│       ├── JobCard.tsx       # 职位卡片（纯展示）
│       ├── StatusUpdater.tsx # 求职进度更新（Client）
│       ├── AddJobForm.tsx    # 录入职位表单（Client）
│       └── ProfileForm.tsx   # 求职画像表单（Client）
├── drizzle.config.ts
├── next.config.ts
└── vercel.json
```

## Server Actions 锚点

所有服务端逻辑通过 Server Actions 暴露，禁止绕过直接操作 DB：

```
lib/actions/jobs.ts
  addJob(input)              ← 新增/更新职位
  getJobs()                  ← 职位列表（含匹配分）
  getJobById(id)             ← 单条职位详情
  updateJobStatus(id, status)← 更新求职进度

lib/actions/match.ts
  scoreJob(jobId)            ← 单条匹配评分
  batchScore()               ← 批量评分

lib/actions/profile.ts
  upsertProfile(input)       ← 保存求职画像
  getProfile()               ← 读取求职画像
```

## 数据库 Schema

3张表：`jobs` · `my_profile` · `matches`

- `my_profile` 永远只有1行（id=1），单行表存求职目标
- `matches.score` 0-100，breakdown 按 title/salary/location/skill 四维拆分
- `jobs.id` 格式：`channel:externalId`（如 `boss:12345`）

## 匹配评分权重

| 维度 | 权重 |
|---|---|
| 职位名称匹配 | 30% |
| 薪资匹配 | 25% |
| 技能匹配 | 25% |
| 地点匹配 | 20% |

评分逻辑在 `lib/actions/match.ts` 底部纯函数，后期可换 LLM。

## 本地启动

```bash
cp .env.local.example .env.local
# 填入 Neon DATABASE_URL

npm install
npm run db:push    # 推送 schema 到 Neon
npm run dev        # http://localhost:3000
```

## 部署

连接 Vercel 项目，设置环境变量 `DATABASE_URL`，push 自动部署。

PWA 在 production build 后生效（dev 模式禁用）。

## 待扩展

- [ ] Boss直聘/LinkedIn 自动抓取渠道
- [ ] LLM 增强匹配（替换规则评分）
- [ ] 批量导入 CSV
- [ ] 投递提醒推送通知
