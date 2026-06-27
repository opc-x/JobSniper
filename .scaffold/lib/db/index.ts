import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * PITFALL: Vercel 生产环境 DATABASE_URL (pooler) = 空字符串
 * 必须用 DATABASE_URL_UNPOOLED（直连端点）
 *
 * PITFALL: channel_binding=require 让 neon() HTTP fetch URL 构造出错
 * 必须 split("?")[0] 去掉 query params
 */
const raw = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!;
const sql = neon(raw.split("?")[0]);
export const db = drizzle(sql, { schema });
