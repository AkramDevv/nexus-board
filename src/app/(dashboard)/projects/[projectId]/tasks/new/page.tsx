import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ListPlus,
} from "lucide-react";
import {
  notFound,
  redirect,
} from "next/navigation";

import { auth } from "../../../../../../../auth";
import { CreateTaskForm } from "@/components/forms/create-task-form";
import { prisma } from "@/lib/prisma";

type NewTaskPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export const metadata: Metadata = {
  title: "New task",
  description: "Create a new project task.",
};

export default async function NewTaskPage({
  params,
}: NewTaskPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,

      OR: [
        {
          ownerId: session.user.id,
        },
        {
          members: {
            some: {
              userId: session.user.id,
              role: {
                in: ["OWNER", "ADMIN"],
              },
            },
          },
        },
      ],
    },

    select: {
      id: true,
      name: true,

      members: {
        orderBy: {
          joinedAt: "asc",
        },

        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/projects/${project.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Back to project
      </Link>

      <div className="mt-6">
        <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <ListPlus className="size-6" />
        </div>

        <p className="mt-6 text-sm font-semibold text-blue-400">
          Task management
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Create a new task
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Add a task, choose its priority, deadline, and
          responsible project member.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
        <CreateTaskForm project={project} />
      </section>
    </div>
  );
}