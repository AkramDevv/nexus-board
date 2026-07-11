import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  notFound,
  redirect,
} from "next/navigation";

import { auth } from "../../../../../../auth";
import { EditTaskForm } from "@/components/forms/edit-task-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Edit task",
};

type EditTaskPageProps = {
  params: Promise<{
    taskId: string;
  }>;
};

export default async function EditTaskPage({
  params,
}: EditTaskPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { taskId } = await params;

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,

      project: {
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
    },

    include: {
      project: {
        select: {
          id: true,
          name: true,

          members: {
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
      },
    },
  });

  if (!task) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/tasks/${task.id}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Back to task
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold text-blue-400">
          Task management
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Edit task
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Update task information, workflow status,
          assignment, and deadline.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
        <EditTaskForm
          task={task}
          members={task.project.members}
        />
      </section>
    </div>
  );
}