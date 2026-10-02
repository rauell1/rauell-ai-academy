import { eq, and } from "drizzle-orm";
import { getDb } from "../src/server/db";
import {
  courses,
  pathways,
  pathwayCourses,
  modules,
  lessons,
  lessonBlocks,
} from "../src/server/schema";
import {
  canonicalCourses,
  canonicalPathways,
} from "../src/data/canonical-curriculum";

export async function seedAllAcademyContent() {
  const db = getDb();
  console.log("Starting comprehensive canonical academy content seeding...");

  // 1. Seed Pathways
  console.log(`Seeding ${canonicalPathways.length} canonical pathways...`);
  const pathwayIdMap = new Map<string, string>();

  for (let pi = 0; pi < canonicalPathways.length; pi++) {
    const pData = canonicalPathways[pi];
    let [pathway] = await db
      .select()
      .from(pathways)
      .where(eq(pathways.slug, pData.slug))
      .limit(1);

    if (!pathway) {
      [pathway] = await db
        .insert(pathways)
        .values({
          slug: pData.slug,
          title: pData.title,
          description: pData.description,
          sortOrder: pi,
          state: "published",
        })
        .returning();
      console.log(`  + Created pathway: ${pData.title} (${pData.slug})`);
    } else {
      [pathway] = await db
        .update(pathways)
        .set({
          title: pData.title,
          description: pData.description,
          sortOrder: pi,
          state: "published",
        })
        .where(eq(pathways.id, pathway.id))
        .returning();
      console.log(`  ~ Updated pathway: ${pData.title} (${pData.slug})`);
    }

    pathwayIdMap.set(pData.slug, pathway.id);
  }

  // 2. Seed Courses, Modules, Lessons, and Blocks
  console.log(`\nSeeding ${canonicalCourses.length} canonical courses...`);
  const courseIdMap = new Map<string, string>();

  for (let ci = 0; ci < canonicalCourses.length; ci++) {
    const cData = canonicalCourses[ci];
    console.log(`\n[Course ${ci + 1}/${canonicalCourses.length}] ${cData.title} (${cData.slug})`);

    let [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.slug, cData.slug))
      .limit(1);

    if (!course) {
      [course] = await db
        .insert(courses)
        .values({
          slug: cData.slug,
          title: cData.title,
          summary: cData.summary,
          description: cData.description,
          level: cData.level,
          estimatedMinutes: cData.estimatedMinutes,
          learningOutcomes: cData.outcomes,
          skills: ["AI Literacy", "Prompting", "Verification"],
          sortOrder: ci,
          state: "published",
        })
        .returning();
      console.log(`  + Created course: ${cData.title}`);
    } else {
      [course] = await db
        .update(courses)
        .set({
          title: cData.title,
          summary: cData.summary,
          description: cData.description,
          level: cData.level,
          estimatedMinutes: cData.estimatedMinutes,
          learningOutcomes: cData.outcomes,
          sortOrder: ci,
          state: "published",
        })
        .where(eq(courses.id, course.id))
        .returning();
      console.log(`  ~ Updated course: ${cData.title}`);
    }

    courseIdMap.set(cData.slug, course.id);

    // Modules
    for (let mi = 0; mi < cData.modules.length; mi++) {
      const mData = cData.modules[mi];
      let [mod] = await db
        .select()
        .from(modules)
        .where(and(eq(modules.courseId, course.id), eq(modules.sortOrder, mi)))
        .limit(1);

      if (!mod) {
        [mod] = await db
          .insert(modules)
          .values({
            courseId: course.id,
            title: mData.title,
            description: mData.description || null,
            sortOrder: mi,
            state: "published",
          })
          .returning();
      } else {
        [mod] = await db
          .update(modules)
          .set({
            title: mData.title,
            description: mData.description || null,
            state: "published",
          })
          .where(eq(modules.id, mod.id))
          .returning();
      }

      // Lessons
      for (let li = 0; li < mData.lessons.length; li++) {
        const lData = mData.lessons[li];
        const lessonSlug = `${mi + 1}-${li + 1}`;

        let [les] = await db
          .select()
          .from(lessons)
          .where(and(eq(lessons.moduleId, mod.id), eq(lessons.sortOrder, li)))
          .limit(1);

        if (!les) {
          [les] = await db
            .insert(lessons)
            .values({
              moduleId: mod.id,
              slug: lessonSlug,
              title: lData.title,
              summary: lData.summary,
              estimatedMinutes: lData.estimatedMinutes || 20,
              isRequired: true,
              sortOrder: li,
              state: "published",
            })
            .returning();
        } else {
          [les] = await db
            .update(lessons)
            .set({
              slug: lessonSlug,
              title: lData.title,
              summary: lData.summary,
              estimatedMinutes: lData.estimatedMinutes || 20,
              state: "published",
            })
            .where(eq(lessons.id, les.id))
            .returning();
        }

        // Lesson Blocks
        if (lData.blocks && lData.blocks.length > 0) {
          // Delete existing blocks and re-insert fresh canonical blocks
          await db
            .delete(lessonBlocks)
            .where(eq(lessonBlocks.lessonId, les.id));

          await db.insert(lessonBlocks).values(
            lData.blocks.map((block, bi) => ({
              lessonId: les.id,
              type: (block.type as
                | "heading"
                | "paragraph"
                | "rich_text"
                | "image"
                | "video"
                | "audio"
                | "code"
                | "table"
                | "callout"
                | "checklist"
                | "download"
                | "citation"
                | "knowledge_check"
                | "key_takeaway") || "paragraph",
              title: block.title,
              plainText: block.plainText,
              config: (block.config as Record<string, unknown>) || {},
              sortOrder: bi,
              state: "published",
            })),
          );
        }
      }
    }
  }

  // 3. Link Pathway Courses
  console.log("\nLinking courses to pathways...");
  for (const pData of canonicalPathways) {
    const pathwayId = pathwayIdMap.get(pData.slug);
    if (!pathwayId) continue;

    for (let pci = 0; pci < pData.courseSlugs.length; pci++) {
      const cSlug = pData.courseSlugs[pci];
      const courseId = courseIdMap.get(cSlug);

      if (courseId) {
        const [existingLink] = await db
          .select()
          .from(pathwayCourses)
          .where(
            and(
              eq(pathwayCourses.pathwayId, pathwayId),
              eq(pathwayCourses.courseId, courseId),
            ),
          )
          .limit(1);

        if (!existingLink) {
          await db.insert(pathwayCourses).values({
            pathwayId,
            courseId,
            sortOrder: pci,
            isRequired: true,
          });
          console.log(`  + Linked [${pData.slug}] -> [${cSlug}]`);
        } else {
          await db
            .update(pathwayCourses)
            .set({ sortOrder: pci, isRequired: true })
            .where(eq(pathwayCourses.id, existingLink.id));
        }
      }
    }
  }

  console.log("\n✓ All 6 pathways and 24 canonical courses seeded live to database!");
}

seedAllAcademyContent().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
