import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Minus,
} from "lucide-react";

import { cn } from "@/lib/utils";

type PriorityBadgeProps = {
  priority: string;
};

const priorityStyles: Record<string, string> = {
  LOW: "border-slate-500/20 bg-slate-500/10 text-slate-400",
  MEDIUM:
    "border-blue-500/20 bg-blue-500/10 text-blue-400",
  HIGH:
    "border-amber-500/20 bg-amber-500/10 text-amber-400",
  URGENT:
    "border-red-500/20 bg-red-500/10 text-red-400",
};

export function PriorityBadge({
  priority,
}: PriorityBadgeProps) {
  const Icon =
    priority === "LOW"
      ? ArrowDown
      : priority === "MEDIUM"
        ? Minus
        : priority === "HIGH"
          ? ArrowUp
          : AlertTriangle;

  const label =
    priority.charAt(0) +
    priority.slice(1).toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        priorityStyles[priority] ??
          priorityStyles.MEDIUM,
      )}
    >
      <Icon className="size-3" />
      {label}
    </span>
  );
}