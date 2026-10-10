export function filterCourses<
  T extends { title: string; summary: string; level: string; skills: string[] },
>(courses: T[], query: string, level: string): T[] {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return courses.filter(
    (course) =>
      (level === "All" || course.level.toLowerCase() === level.toLowerCase()) &&
      terms.every((term) =>
        `${course.title} ${course.summary} ${course.skills.join(" ")}`
          .toLocaleLowerCase()
          .includes(term),
      ),
  );
}

export function formatCourseDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return "Self paced";
  const total = Math.round(minutes);
  const hours = Math.floor(total / 60);
  const remainder = total % 60;
  return [
    hours ? `${hours} ${hours === 1 ? "hour" : "hours"}` : "",
    remainder ? `${remainder} min` : "",
  ]
    .filter(Boolean)
    .join(" ");
}
