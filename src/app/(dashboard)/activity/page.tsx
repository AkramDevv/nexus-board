import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity as ActivityIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  format,
  isSameDay,
  subDays,
} from "date-fns";

import { auth } from "../../../../auth";
import { ActivityItem } from "@/components/dashboard/activity-item";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Activity",
  description:
    "Review recent project, task, and member activity.",
};

type ActivityPageProps = {
  searchParams: Promise<{
    type?: string;
    page?: string;
  }>;
};

const activityFilters = [
  {
    label: "All activity",
    value: "ALL",
  },
  {
    label: "Projects",
    value: "PROJECT",
  },
  {
    label: "Tasks",
    value: "TASK",
  },
  {
    label: "Members",
    value: "MEMBER",
  },
];

const pageSize = 10;

function getActivityTypes(filter: string) {
  if (filter === "PROJECT") {
    return [
      "PROJECT_CREATED",
      "PROJECT_UPDATED",
      "PROJECT_COMPLETED",
    ];
  }

  if (filter === "TASK") {
    return [
      "TASK_CREATED",
      "TASK_UPDATED",
      "TASK_STATUS_CHANGED",
      "TASK_COMPLETED",
      "TASK_DELETED",
    ];
  }

  if (filter === "MEMBER") {
    return [
      "MEMBER_ADDED",
      "MEMBER_REMOVED",
      "MEMBER_ROLE_UPDATED",
    ];
  }

  return null;
}

function getDateLabel(date: Date) {
  const today = new Date();
  const yesterday = subDays(today, 1);

  if (isSameDay(date, today)) {
    return "Today";
  }

  if (isSameDay(date, yesterday)) {
    return "Yesterday";
  }

  return format(date, "MMMM d, yyyy");
}

export default async function ActivityPage({
  searchParams,
}: ActivityPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const params = await searchParams;

  const selectedFilter = params.type ?? "ALL";

  const requestedPage = Number(params.page ?? "1");

  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1;

  const accessibleProjects =
    await prisma.project.findMany({
      where: {
        OR: [
          {
            ownerId: session.user.id,
          },
          {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },

      select: {
        id: true,
      },
    });

  const projectIds = accessibleProjects.map(
    (project) => project.id,
  );

  const filteredTypes =
    getActivityTypes(selectedFilter);

  const activityWhere = {
    projectId: {
      in: projectIds,
    },

    ...(filteredTypes
      ? {
          type: {
            in: filteredTypes,
          },
        }
      : {}),
  };

  const [activities, totalActivities] =
    await Promise.all([
      prisma.activity.findMany({
        where: activityWhere,

        orderBy: {
          createdAt: "desc",
        },

        skip: (currentPage - 1) * pageSize,
        take: pageSize,

        include: {
          project: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },

          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),

      prisma.activity.count({
        where: activityWhere,
      }),
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalActivities / pageSize),
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages,
  );

  if (
    currentPage !== safeCurrentPage &&
    totalActivities > 0
  ) {
    const filterParam =
      selectedFilter !== "ALL"
        ? `&type=${selectedFilter}`
        : "";

    redirect(
      `/activity?page=${safeCurrentPage}${filterParam}`,
    );
  }

  const groupedActivities = activities.reduce<
    {
      label: string;
      date: Date;
      activities: typeof activities;
    }[]
  >((groups, activity) => {
    const existingGroup = groups.find((group) =>
      isSameDay(group.date, activity.createdAt),
    );

    if (existingGroup) {
      existingGroup.activities.push(activity);
      return groups;
    }

    groups.push({
      label: getDateLabel(activity.createdAt),
      date: activity.createdAt,
      activities: [activity],
    });

    return groups;
  }, []);

  function buildPageHref(page: number) {
    const searchParams = new URLSearchParams();

    if (selectedFilter !== "ALL") {
      searchParams.set("type", selectedFilter);
    }

    if (page > 1) {
      searchParams.set("page", String(page));
    }

    const query = searchParams.toString();

    return query ? `/activity?${query}` : "/activity";
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <p className="text-sm font-semibold text-blue-400">
          History
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Activity
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Review recent changes across your accessible
          projects.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <Filter className="size-4" />
          Filter activity
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {activityFilters.map((filter) => {
            const href =
              filter.value === "ALL"
                ? "/activity"
                : `/activity?type=${filter.value}`;

            return (
              <Link
                key={filter.value}
                href={href}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm font-medium transition",
                  selectedFilter === filter.value
                    ? "bg-blue-600 text-white"
                    : "border border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white",
                )}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {totalActivities}{" "}
          {totalActivities === 1
            ? "activity record"
            : "activity records"}
        </p>

        <p className="text-sm text-slate-600">
          Page {safeCurrentPage} of {totalPages}
        </p>
      </div>

      {groupedActivities.length > 0 ? (
        <div className="mt-5 space-y-6">
          {groupedActivities.map((group) => (
            <section key={group.label}>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-sm font-semibold text-slate-400">
                  {group.label}
                </h2>

                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
                <div className="divide-y divide-slate-800">
                  {group.activities.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                    />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section className="mt-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-20 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-900">
            <ActivityIcon className="size-8 text-slate-600" />
          </div>

          <h2 className="mt-6 text-xl font-semibold text-white">
            No activity found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Activity records will appear after projects,
            tasks, or members are changed.
          </p>
        </section>
      )}

      {totalPages > 1 ? (
        <nav
          aria-label="Activity pagination"
          className="mt-8 flex items-center justify-between"
        >
          {safeCurrentPage > 1 ? (
            <Link
              href={buildPageHref(safeCurrentPage - 1)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
            >
              <ChevronLeft className="size-4" />
              Previous
            </Link>
          ) : (
            <span />
          )}

          {safeCurrentPage < totalPages ? (
            <Link
              href={buildPageHref(safeCurrentPage + 1)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
            >
              Next
              <ChevronRight className="size-4" />
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}