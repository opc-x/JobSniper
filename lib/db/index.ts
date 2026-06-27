import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// neon() HTTP driver constructs its own HTTPS URL from host/credentials.
// channel_binding=require and sslmode in query string break the HTTP fetch.
// The unpooled endpoint avoids pgbouncer quirks; strip ?params either way.
const rawUrl =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL!;
const connStr = rawUrl.split("?")[0];

const sql = neon(connStr);
export const db = drizzle(sql, { schema });
