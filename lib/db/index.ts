import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Strip ?channel_binding=require&sslmode=require — neon() HTTP driver
// handles TLS itself and chokes on these params when building the fetch URL.
const connStr = process.env.DATABASE_URL!.split("?")[0];

const sql = neon(connStr);
export const db = drizzle(sql, { schema });
