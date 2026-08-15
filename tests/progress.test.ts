import { describe, expect, it } from "vitest";
import { completionBasisPoints, parseLocalProgress } from "../src/lib/progress";
function storage(
  values: Record<string, string>,
): Pick<Storage, "length" | "key" | "getItem"> {
  const keys = Object.keys(values);
  return {
    length: keys.length,
    key: (i) => keys[i] ?? null,
    getItem: (key) => values[key] ?? null,
  };
}
describe("authoritative progress helpers", () => {
  it("calculates bounded basis points", () => {
    expect(completionBasisPoints(1, 4)).toBe(2500);
    expect(completionBasisPoints(5, 4)).toBe(10000);
    expect(completionBasisPoints(0, 0)).toBe(0);
  });
  it("rejects invalid counts", () =>
    expect(() => completionBasisPoints(-1, 2)).toThrow());
  it("only offers valid completed local records", () =>
    expect(
      parseLocalProgress(
        storage({
          "done:course-one:1-2": "1",
          "done:course-one:no": "1",
          other: "1",
          "done:course-two:2-1": "0",
        }),
      ),
    ).toEqual([
      {
        key: "done:course-one:1-2",
        courseSlug: "course-one",
        lessonKey: "1-2",
      },
    ]));
});
