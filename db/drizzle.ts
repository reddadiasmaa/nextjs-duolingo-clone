import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const isNeon = process.env.DATABASE_URL?.includes("neon.tech");

let db: any;

if (isNeon) {
  const sql = neon(process.env.DATABASE_URL!);
  // @ts-ignore
  db = drizzleNeon(sql, { schema });
} else {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  });
  db = drizzlePg(pool, { schema });
}

export default db;
