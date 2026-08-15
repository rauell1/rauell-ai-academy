export type LocalProgressItem = {
  key: string;
  courseSlug: string;
  lessonKey: string;
};
export function parseLocalProgress(
  storage: Pick<Storage, "length" | "key" | "getItem">,
): LocalProgressItem[] {
  const items: LocalProgressItem[] = [];
  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (!key || !key.startsWith("done:") || storage.getItem(key) !== "1")
      continue;
    const [, courseSlug, lessonKey, ...extra] = key.split(":");
    if (!courseSlug || !/^\d+-\d+$/.test(lessonKey || "") || extra.length)
      continue;
    items.push({ key, courseSlug, lessonKey });
  }
  return items;
}
export function completionBasisPoints(completed: number, required: number) {
  if (
    !Number.isInteger(completed) ||
    !Number.isInteger(required) ||
    completed < 0 ||
    required < 0
  )
    throw new Error("Progress counts must be non-negative integers.");
  return required === 0
    ? 0
    : Math.min(10000, Math.round((completed / required) * 10000));
}
