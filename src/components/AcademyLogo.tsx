import { ACADEMY_BRAND } from "@/lib/brand";
export function AcademyLogo({
  className = "",
  decorative = false,
}: {
  className?: string;
  decorative?: boolean;
}) {
  return (
    <img
      src={ACADEMY_BRAND.logoPath}
      alt={decorative ? "" : ACADEMY_BRAND.name}
      className={`object-contain ${className}`}
    />
  );
}
