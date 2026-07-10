import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "../../../../../auth";
import { CreateProjectForm } from "@/components/forms/create-project-form";

export const metadata: Metadata = {
  title: "New project",
  description: "Create a new NexusBoard project.",
};

export default async function NewProjectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div>
        <p className="text-sm font-semibold text-blue-400">
          Project management
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Create a new project
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Organize your tasks, team members, deadlines, and project
          activity in one workspace.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
        <CreateProjectForm />
      </section>
    </div>
  );
}