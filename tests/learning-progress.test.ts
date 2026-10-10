import { afterEach, expect, it, vi } from "vitest";
import { readCourseProgress } from "../src/lib/learning-progress";
const lessons = [
  { slug: "1-1", title: "Start" },
  { slug: "1-2", title: "Apply" },
];
afterEach(() => vi.unstubAllGlobals());
it("resumes the first unfinished lesson, ignoring unknown or unrelated records", () => {
  const records: Record<string, string> = {
    "done:course:1-1": "true",
    "done:course:8-9": "1",
    "done:other:1-2": "1",
  };
  vi.stubGlobal("localStorage", {
    length: 3,
    key: (i: number) => Object.keys(records)[i],
    getItem: (key: string) => records[key] ?? null,
  });
  const result = readCourseProgress("course", lessons);
  expect(result.count).toBe(1);
  expect(result.percent).toBe(50);
  expect(result.next?.slug).toBe("1-2");
});
it("shows no saved progress when storage is blocked", () => {
  vi.stubGlobal("localStorage", {
    get length() {
      throw new Error("Storage blocked");
    },
  });
  expect(readCourseProgress("course", lessons).count).toBe(0);
  expect(readCourseProgress("course", lessons).next?.slug).toBe("1-1");
});
