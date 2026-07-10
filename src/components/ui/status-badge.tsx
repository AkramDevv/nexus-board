import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
};

const statusStyles: Record<string, string> = {
  ACTIVE:
    "border-blue-500/20 bg-blue-500/10 text-blue-400",
  COMPLETED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  ARCHIVED:
    "border-slate-500/20 bg-slate-500/10 text-slate-400",

  TODO:
    "border-slate-500/20 bg-slate-500/10 text-slate-400",
  IN_PROGRESS:
    "border-blue-500/20 bg-blue-500/10 text-blue-400",
  REVIEW:
    "border-amber-500/20 bg-amber-500/10 text-amber-400",
  DONE:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
};

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  const label = status
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
        statusStyles[status] ??
          "border-slate-500/20 bg-slate-500/10 text-slate-400",
      )}
    >
      {label}
    </span>
  );
}