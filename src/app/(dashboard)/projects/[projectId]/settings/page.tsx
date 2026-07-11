import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import {
  notFound,
  redirect,
} from "next/navigation";

import { auth } from "../../../../../../auth";
import { ProjectSettingsForm } from "@/components/forms/project-settings-form";
import { DeleteProjectForm } from "@/components/projects/delete-project-form";
import { prisma } from "@/lib/prisma";

type ProjectSettingsPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export const metadata: Metadata = {
  title: "Project settings",
  description:
    "Update project information and workspace preferences.",
};

export default async function ProjectSettingsPage({
  params,
}: ProjectSettingsPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      status: true,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href={`/projects/${project.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Back to project
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold text-blue-400">
          Project management
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Project settings
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Update project information, status, visual identity,
          or permanently remove the project.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
        <div className="mb-7">
          <h2 className="text-lg font-semibold text-white">
            General information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Change the name, description, status, and color.
          </p>
        </div>

        <ProjectSettingsForm project={project} />
      </section>

      <section className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <ShieldAlert className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Danger zone
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Deleting this project permanently removes its tasks,
              comments, member relations, and activity history. This
              operation cannot be undone.
            </p>

            <DeleteProjectForm
              projectId={project.id}
              projectName={project.name}
            />
          </div>
        </div>
      </section>
    </div>
  );
}