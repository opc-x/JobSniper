import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const channelEnum = pgEnum("channel", [
  "boss",
  "linkedin",
  "lagou",
  "zhaopin",
  "manual",
]);

export const statusEnum = pgEnum("status", [
  "new",
  "viewed",
  "applied",
  "interview",
  "offer",
  "rejected",
  "ignored",
]);

// ─── Tables ───────────────────────────────────────────────────────────────────

/**
 * 职位表：从各渠道抓取/录入的职位原始数据
 */
export const jobs = pgTable("jobs", {
  id: text("id").primaryKey(), // channel:externalId
  channel: channelEnum("channel").notNull(),
  externalId: varchar("external_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  salary: varchar("salary", { length: 100 }),
  description: text("description"),
  requirements: text("requirements"),
  rawData: jsonb("raw_data"),            // 渠道原始响应，备用
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * 我的求职目标画像：用来做匹配的锚点
 */
export const myProfile = pgTable("my_profile", {
  id: integer("id").primaryKey().default(1),  // 单行表，id永远为1
  targetTitle: text("target_title"),
  targetSalaryMin: integer("target_salary_min"),
  targetSalaryMax: integer("target_salary_max"),
  targetLocations: jsonb("target_locations").$type<string[]>(),
  skills: jsonb("skills").$type<string[]>(),
  yearsOfExp: integer("years_of_exp"),
  resumeSummary: text("resume_summary"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * 匹配记录：每个职位的匹配得分与分析
 */
export const matches = pgTable("matches", {
  id: text("id").primaryKey(),
  jobId: text("job_id").notNull().references(() => jobs.id).unique(),
  score: integer("score").notNull(),           // 0-100
  scoreBreakdown: jsonb("score_breakdown").$type<{
    titleMatch: number;
    salaryMatch: number;
    locationMatch: number;
    skillMatch: number;
  }>(),
  aiSummary: text("ai_summary"),
  status: statusEnum("status").default("new").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
