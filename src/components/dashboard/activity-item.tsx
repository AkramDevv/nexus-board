import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { getActivityVisual } from "@/lib/activity";
import { cn } from "@/lib/utils";

type ActivityItemProps = {
  activity: {
    id: string;
    type: string;
    message: string;
    createdAt: Date;

    project: {
      id: string;
      name: string;
      color: string;
    } | null;

    user: {
      id: string;
      name: string;
      email: string;
    } | null;
  };
};

export function ActivityItem({
  activity,
}: ActivityItemProps) {
  const visual = getActivityVisual(activity.type);
  const Icon = visual.icon;

  const initials =
    activity.user?.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "NB";

  return (
    <article className="relative flex gap-4 px-5 py-5 transition hover:bg-slate-900 sm:px-6">
      <div
        className={cn(
          "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-xl border",
          visual.className,
        )}
      >
        <Icon className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                {visual.label}
              </span>

              {activity.project ? (
                <>
                  <span className="text-slate-700">•</span>

                  <Link
                    href={`/projects/${activity.project.id}`}
                    className="flex items-center gap-2 text-xs font-semibold text-blue-400 transition hover:text-blue-300"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{
                        backgroundColor:
                          activity.project.color,
                      }}
                    />

                    {activity.project.name}
                  </Link>
                </>
              ) : null}
            </div>

            <p className="mt-2 leading-6 text-slate-300">
              {activity.message}
            </p>
          </div>

          <time
            dateTime={activity.createdAt.toISOString()}
            className="shrink-0 text-xs text-slate-600"
          >
            {formatDistanceToNow(activity.createdAt, {
              addSuffix: true,
            })}
          </time>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-[11px] font-bold text-white">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-400">
              {activity.user?.name ?? "System"}
            </p>

            {activity.user?.email ? (
              <p className="truncate text-xs text-slate-600">
                {activity.user.email}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}