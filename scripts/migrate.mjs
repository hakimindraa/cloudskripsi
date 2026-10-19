import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const password = "SZg7VUhXlHfYeoJr";
const projectRef = "dtcuximjpssuhlmrbwgi";

// Try pooler connection first, then direct
const connectionConfigs = [
  {
    connectionString: `postgres://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`,
    ssl: { rejectUnauthorized: false },
    name: "Supabase Pooler (Tokyo)",
  },
  {
    connectionString: `postgres://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false },
    name: "Supabase Direct (5432)",
  },
  {
    connectionString: `postgres://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres`,
    ssl: { rejectUnauthorized: false },
    name: "Supabase Pooler (5432)",
  },
];

async function runMigration() {
  const schemaPath = path.join(__dirname, "../supabase/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");

  for (const config of connectionConfigs) {
    console.log(`Trying to connect via ${config.name}...`);
    const client = new pg.Client({
      connectionString: config.connectionString,
      ssl: config.ssl,
    });

    try {
      await client.connect();
      console.log(`Successfully connected to ${config.name}! Executing schema.sql...`);
      await client.query(sql);
      console.log("MIGRATION SUCCESS: All tables, columns, and RLS policies created!");
      await client.end();
      return;
    } catch (err) {
      console.log(`Failed on ${config.name}: ${err.message}`);
      try {
        await client.end();
      } catch {}
    }
  }

  console.error("All connection attempts failed. Check password or pooler host.");
  process.exit(1);
}

runMigration();
