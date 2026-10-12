import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`group relative inline-flex items-center justify-center rounded-full border border-ink/15 bg-paper/90 text-ink shadow-xs transition hover:border-ink/30 hover:bg-paper focus-visible:outline-2 focus-visible:outline-mint ${
        compact ? "h-9 w-9" : "h-9 px-3 gap-2"
      } ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4 text-mint transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="h-4 w-4 text-ink/75 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </span>
      {!compact && (
        <span className="text-[12px] font-bold tracking-wide">
          {isDark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}
