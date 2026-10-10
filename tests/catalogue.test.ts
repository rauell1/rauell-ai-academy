import { describe, expect, it } from "vitest";
import { filterCourses, formatCourseDuration } from "../src/lib/catalogue";
const courses = [
  {
    title: "Solar analysis",
    summary: "Verify operational data",
    level: "Intermediate",
    skills: ["Telemetry"],
  },
  {
    title: "AI foundations",
    summary: "Learn prompting",
    level: "Beginner",
    skills: ["Verification"],
  },
];
describe("course discovery", () => {
  it("combines search terms, skills, and case-insensitive level filters", () => {
    expect(filterCourses(courses, " SOLAR telemetry ", "intermediate")).toEqual(
      [courses[0]],
    );
    expect(filterCourses(courses, "solar", "Beginner")).toEqual([]);
    expect(filterCourses(courses, "", "All")).toEqual(courses);
    expect(filterCourses(courses, "verification", "All")).toEqual([courses[1]]);
  });
  it("keeps short and fractional-hour course durations accurate", () => {
    expect(formatCourseDuration(30)).toBe("30 min");
    expect(formatCourseDuration(90)).toBe("1 hour 30 min");
    expect(formatCourseDuration(120)).toBe("2 hours");
    expect(formatCourseDuration(0)).toBe("Self paced");
  });
});
