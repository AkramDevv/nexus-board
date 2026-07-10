import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  ListTodo,
  Users,
} from "lucide-react";
import { format } from "date-fns";

import { StatusBadge } from "@/components/ui/status-badge";

type ProjectCardProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
    color: string;
    status: string;
    createdAt: Date;

    _count: {
      tasks: number;
      members: number;
    };

    tasks: {
      status: string;
    }[];
  };
};

export function ProjectCard({
  project,
}: ProjectCardProps) {
  const completedTasks = project.tasks.filter(
    (task) => task.status === "DONE",
  ).length;

  const progress =
    project._count.tasks === 0
      ? 0
      : Math.round(
          (completedTasks / project._count.tasks) * 100,
        );

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl hover:shadow-black/20"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="flex size-12 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${project.color}20`,
            color: project.color,
          }}
        >
          <ListTodo className="size-6" />
        </span>

        <StatusBadge status={project.status} />
      </div>

      <div className="mt-5">
        <h2 className="text-lg font-semibold text-white transition group-hover:text-blue-400">
          {project.name}
        </h2>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
          {project.description ??
            "No project description has been added."}
        </p>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Project progress
          </span>

          <span className="font-semibold text-slate-300">
            {progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: project.color,
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-800 pt-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <ListTodo className="size-3.5" />
            Tasks
          </div>

          <p className="mt-1 text-sm font-semibold text-slate-300">
            {project._count.tasks}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Users className="size-3.5" />
            Members
          </div>

          <p className="mt-1 text-sm font-semibold text-slate-300">
            {project._count.members}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <CheckCircle2 className="size-3.5" />
            Done
          </div>

          <p className="mt-1 text-sm font-semibold text-slate-300">
            {completedTasks}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-slate-600">
        <CalendarDays className="size-3.5" />
        Created {format(project.createdAt, "MMM d, yyyy")}
      </div>
    </Link>
  );
}