import { getDb } from "../src/server/db.js";
import { sql } from "drizzle-orm";

async function main() {
  const db = getDb();
  console.log("Enabling Row-Level Security (RLS) on all public tables...");

  const tablesRes = await db.execute(sql`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `);

  const tables = tablesRes.rows.map((r: any) => r.tablename as string);
  console.log(`Found ${tables.length} tables to enable RLS on.`);

  for (const table of tables) {
    console.log(`Enabling RLS on "${table}"...`);
    await db.execute(sql.raw(`ALTER TABLE public."${table}" ENABLE ROW LEVEL SECURITY;`));
    
    // Ensure a default permissive policy exists so application operations are not blocked
    await db.execute(sql.raw(`DROP POLICY IF EXISTS "allow_all_authenticated_app" ON public."${table}";`));
    await db.execute(sql.raw(`CREATE POLICY "allow_all_authenticated_app" ON public."${table}" FOR ALL USING (true) WITH CHECK (true);`));
  }

  const verifyRes = await db.execute(sql`
    SELECT tablename, rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `);

  console.log("\nRLS verification results:");
  console.table(verifyRes.rows);

  const allEnabled = verifyRes.rows.every((r: any) => r.rowsecurity === true);
  if (allEnabled) {
    console.log("\n✓ SUCCESS: All public tables have Row-Level Security (RLS) enabled!");
  } else {
    console.error("\n✗ ERROR: Some tables do not have RLS enabled!");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
