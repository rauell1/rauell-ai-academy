import { useEffect, useState } from "react";
import { parseLocalProgress } from "./progress";

export type LessonReference = { slug: string; title: string };
export function readCourseProgress(
  courseSlug: string,
  lessons: LessonReference[],
) {
  let completed = new Set<string>();
  try {
    completed = new Set(
      parseLocalProgress(localStorage)
        .filter((item) => item.courseSlug === courseSlug)
        .map((item) => item.lessonKey),
    );
  } catch {
    /* Browser storage is optional. */
  }
  const count = lessons.filter((lesson) => completed.has(lesson.slug)).length;
  return {
    completed,
    count,
    total: lessons.length,
    next: lessons.find((lesson) => !completed.has(lesson.slug)),
    percent: lessons.length ? Math.round((count / lessons.length) * 100) : 0,
  };
}
export function useCourseProgress(
  courseSlug: string,
  lessons: LessonReference[],
) {
  const [, refresh] = useState(0);
  useEffect(() => {
    const update = () => refresh((value) => value + 1);
    window.addEventListener("academy-progress", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("academy-progress", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return readCourseProgress(courseSlug, lessons);
}
export function safeStorageGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
