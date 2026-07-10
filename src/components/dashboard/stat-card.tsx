import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number;
  description: string;
  change: number;
  icon: LucideIcon;
};

export function StatCard({
  title,
  value,
  description,
  change,
  icon: Icon,
}: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>
        </div>

        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <Icon className="size-5" />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs">
        <span
          className={
            isPositive
              ? "flex items-center gap-1 font-semibold text-emerald-400"
              : "flex items-center gap-1 font-semibold text-red-400"
          }
        >
          {isPositive ? (
            <TrendingUp className="size-3.5" />
          ) : (
            <TrendingDown className="size-3.5" />
          )}

          {Math.abs(change)}%
        </span>

        <span className="text-slate-600">
          {description}
        </span>
      </div>
    </article>
  );
}