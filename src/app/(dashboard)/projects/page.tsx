import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FolderKanban,
  Plus,
  Search,
} from "lucide-react";

import { auth } from "../../../../auth";
import { ProjectCard } from "@/components/projects/project-card";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "View and manage all projects in your NexusBoard workspace.",
};

type ProjectsPageProps = {
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
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
  {
    label: "Archived",
    value: "ARCHIVED",
  },
];

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const params = await searchParams;

  const query = params.query?.trim() ?? "";
  const status = params.status ?? "ALL";

  const projects = await prisma.project.findMany({
    where: {
      AND: [
        {
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

        query
          ? {
              OR: [
                {
                  name: {
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
          : {},

        status !== "ALL"
          ? {
              status: status as
                | "ACTIVE"
                | "COMPLETED"
                | "ARCHIVED",
            }
          : {},
      ],
    },

    orderBy: {
      updatedAt: "desc",
    },

    include: {
      _count: {
        select: {
          tasks: true,
          members: true,
        },
      },

      tasks: {
        select: {
          status: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-blue-400">
            Workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Projects
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage all projects, tasks, members, and progress.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <Plus className="size-4" />
          New project
        </Link>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
        <form className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-600" />

            <input
              name="query"
              type="search"
              defaultValue={query}
              placeholder="Search projects..."
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
                    ? `/projects?query=${encodeURIComponent(query)}`
                    : "/projects"
                  : `/projects?status=${filter.value}${
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
          {projects.length}{" "}
          {projects.length === 1 ? "project" : "projects"} found
        </p>

        {query || status !== "ALL" ? (
          <Link
            href="/projects"
            className="text-sm font-semibold text-blue-400 hover:text-blue-300"
          >
            Clear filters
          </Link>
        ) : null}
      </div>

      {projects.length > 0 ? (
        <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </section>
      ) : (
        <section className="mt-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-20 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-900">
            <FolderKanban className="size-8 text-slate-600" />
          </div>

          <h2 className="mt-6 text-xl font-semibold text-white">
            No projects found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {query || status !== "ALL"
              ? "Try changing your search query or clearing the selected filter."
              : "Create your first project to start organizing tasks and teamwork."}
          </p>

          {!query && status === "ALL" ? (
            <Link
              href="/projects/new"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <Plus className="size-4" />
              Create first project
            </Link>
          ) : null}
        </section>
      )}
    </div>
  );
}