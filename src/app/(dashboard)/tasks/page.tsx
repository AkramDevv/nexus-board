import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  ListTodo,
  Search,
} from "lucide-react";
import {
  format,
  isBefore,
  startOfToday,
} from "date-fns";

import { auth } from "../../../../auth";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Tasks",
  description:
    "View assigned and created tasks across your projects.",
};

type TasksPageProps = {
  searchParams: Promise<{
    query?: string;
    status?: string;
  }>;
};

const statusFilters = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "To do",
    value: "TODO",
  },
  {
    label: "In progress",
    value: "IN_PROGRESS",
  },
  {
    label: "Review",
    value: "REVIEW",
  },
  {
    label: "Done",
    value: "DONE",
  },
];

export default async function TasksPage({
  searchParams,
}: TasksPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const params = await searchParams;

  const query = params.query?.trim() ?? "";
  const status = params.status ?? "ALL";

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

  const tasks = await prisma.task.findMany({
    where: {
      projectId: {
        in: projectIds,
      },

      ...(query
        ? {
            OR: [
              {
                title: {
                  contains: query,
                },
              },
              {
                description: {
                  contains: query,
                },
              },
            ],
          }
        : {}),

      ...(status !== "ALL"
        ? {
            status: status as
              | "TODO"
              | "IN_PROGRESS"
              | "REVIEW"
              | "DONE",
          }
        : {}),
    },

    orderBy: [
      {
        dueDate: "asc",
      },
      {
        updatedAt: "desc",
      },
    ],

    include: {
      project: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },

      assignee: {
        select: {
          id: true,
          name: true,
        },
      },

      creator: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <div>
        <p className="text-sm font-semibold text-blue-400">
          Productivity
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          My Tasks
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Track work across all projects in your workspace.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
        <form className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-600" />

            <input
              name="query"
              type="search"
              defaultValue={query}
              placeholder="Search tasks..."
              className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />

            {status !== "ALL" ? (
              <input
                type="hidden"
                name="status"
                value={status}
              />
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => {
              const href =
                filter.value === "ALL"
                  ? query
                    ? `/tasks?query=${encodeURIComponent(query)}`
                    : "/tasks"
                  : `/tasks?status=${filter.value}${
                      query
                        ? `&query=${encodeURIComponent(query)}`
                        : ""
                    }`;

              return (
                <Link
                  key={filter.value}
                  href={href}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm font-medium transition",
                    status === filter.value
                      ? "bg-blue-600 text-white"
                      : "border border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white",
                  )}
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>
        </form>
      </section>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {tasks.length}{" "}
          {tasks.length === 1 ? "task" : "tasks"} found
        </p>

        {query || status !== "ALL" ? (
          <Link
            href="/tasks"
            className="text-sm font-semibold text-blue-400 hover:text-blue-300"
          >
            Clear filters
          </Link>
        ) : null}
      </div>

      {tasks.length > 0 ? (
        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="divide-y divide-slate-800">
            {tasks.map((task) => {
              const isOverdue =
                task.dueDate &&
                task.status !== "DONE" &&
                isBefore(
                  task.dueDate,
                  startOfToday(),
                );

              return (
                <article
                  key={task.id}
                  className="p-5 transition hover:bg-slate-900 sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-semibold text-white">
                          {task.title}
                        </h2>

                        <PriorityBadge
                          priority={task.priority}
                        />

                        <StatusBadge
                          status={task.status}
                        />
                      </div>

                      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                        {task.description ??
                          "No task description has been added."}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-slate-600">
                        <Link
                          href={`/projects/${task.project.id}`}
                          className="flex items-center gap-2 transition hover:text-white"
                        >
                          <span
                            className="size-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                task.project.color,
                            }}
                          />

                          {task.project.name}
                        </Link>

                        <span>
                          Assignee:{" "}
                          {task.assignee?.name ??
                            "Unassigned"}
                        </span>

                        <span>
                          Created by: {task.creator.name}
                        </span>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-sm",
                        isOverdue
                          ? "border-red-500/20 bg-red-500/10 text-red-400"
                          : "border-slate-800 bg-slate-950 text-slate-400",
                      )}
                    >
                      <CalendarDays className="size-4" />

                      {task.dueDate
                        ? format(
                            task.dueDate,
                            "MMM d, yyyy",
                          )
                        : "No deadline"}

                      {isOverdue ? (
                        <span className="font-semibold">
                          · Overdue
                        </span>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="mt-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-20 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-900">
            <ListTodo className="size-8 text-slate-600" />
          </div>

          <h2 className="mt-6 text-xl font-semibold text-white">
            No tasks found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Tasks created inside your accessible projects
            will appear here.
          </p>
        </section>
      )}
    </div>
  );
}