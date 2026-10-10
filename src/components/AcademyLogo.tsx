export function AcademyLogo({
  className = "",
  decorative = false,
}: {
  className?: string;
  decorative?: boolean;
}) {
  return (
    <img
      src="/academy-logo.png"
      alt={decorative ? "" : "Rauell AI Academy"}
      className={`object-contain ${className}`}
    />
  );
}
