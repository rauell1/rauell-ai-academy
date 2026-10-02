import { neon } from "@neondatabase/serverless";

async function check() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not found in environment.");
    process.exit(1);
  }
  const sql = neon(dbUrl);
  console.log("Connecting to database...");

  // Check tables in public schema
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  console.log("=== PUBLIC TABLES IN DATABASE ===");
  console.log(tables.map((t: Record<string, unknown>) => t.table_name).join("\n"));

  // Check migrations table
  try {
    const migrations = await sql`
      SELECT id, hash, created_at 
      FROM drizzle.__drizzle_migrations 
      ORDER BY created_at DESC;
    `;
    console.log("\n=== APPLIED DRIZZLE MIGRATIONS ===");
    console.log(JSON.stringify(migrations, null, 2));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log("\nNo drizzle.__drizzle_migrations table found or error:", msg);
  }

  // Check counts in curriculum tables
  try {
    const pathwayCount = await sql`SELECT count(*) FROM pathways;`;
    const courseCount = await sql`SELECT count(*) FROM courses;`;
    const moduleCount = await sql`SELECT count(*) FROM modules;`;
    const lessonCount = await sql`SELECT count(*) FROM lessons;`;
    const blockCount = await sql`SELECT count(*) FROM lesson_blocks;`;
    console.log("\n=== ROW COUNTS ===");
    console.log({
      pathways: pathwayCount[0].count,
      courses: courseCount[0].count,
      modules: moduleCount[0].count,
      lessons: lessonCount[0].count,
      lesson_blocks: blockCount[0].count,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log("Could not query row counts:", msg);
  }
}

check().catch(e => {
  console.error("Error:", e);
  process.exit(1);
});
