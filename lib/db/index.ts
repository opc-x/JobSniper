import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Production Vercel sets DATABASE_URL_UNPOOLED (direct compute endpoint).
// The pooler URL is empty in prod and its host format breaks the HTTP driver.
// Strip ?params — neon() HTTP driver handles TLS itself.
const raw = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!;
const sql = neon(raw.split("?")[0]);
export const db = drizzle(sql, { schema });
