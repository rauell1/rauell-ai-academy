export const ACADEMY_BRAND = {
  name: "Rauell AI Academy",
  tagline: "Practical AI learning. Build useful things. Prove they work.",
  origin: "https://learn.rauell.systems",
  logoPath: "/academy-logo.png",
  hubUrl: "https://rauell.systems",
  contactEmail: "contact@rauell.systems",
  colors: {
    navy: "#0b1830",
    lime: "#c9f260",
    paper: "#fdfcf8",
    cream: "#f6f5ef",
  },
} as const;

export function academyUrl(
  path: string,
  origin: string = ACADEMY_BRAND.origin,
) {
  const base = new URL(origin);
  if (
    !["https:", "http:"].includes(base.protocol) ||
    base.username ||
    base.password
  )
    throw new Error(
      "Academy origin must be an HTTP or HTTPS origin without credentials.",
    );
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\"))
    throw new Error("Academy links must use a local absolute path.");
  return new URL(path, base.origin).href;
}
