import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
    ArrowLeft,
    CalendarDays,
    ListTodo,
    Plus,
    Settings,
    Users,
} from "lucide-react";
import { format } from "date-fns";

import { auth } from "../../../../../auth";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/prisma";
import { PriorityBadge } from "@/components/ui/priority-badge";

type ProjectDetailsPageProps = {
    params: Promise<{
        projectId: string;
    }>;
};

export async function generateMetadata({
    params,
}: ProjectDetailsPageProps): Promise<Metadata> {
    const { projectId } = await params;

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
        select: {
            name: true,
        },
    });

    if (!project) {
        return {
            title: "Project not found",
        };
    }

    return {
        title: project.name,
        description: `View the ${project.name} project in NexusBoard.`,
    };
}

export default async function ProjectDetailsPage({
    params,
}: ProjectDetailsPageProps) {
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
                        },
                    },
                },
            ],
        },

        include: {
            owner: {
                select: {
                    name: true,
                    email: true,
                },
            },

            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },

            tasks: {
                orderBy: {
                    createdAt: "desc",
                },

                include: {
                    assignee: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },

            _count: {
                select: {
                    tasks: true,
                    members: true,
                },
            },
        },
    });

    if (!project) {
        notFound();
    }

    const currentMembership = project.members.find(
        (member) =>
            member.userId === session.user.id,
    );

    const canManageTasks =
        project.ownerId === session.user.id ||
        currentMembership?.role === "OWNER" ||
        currentMembership?.role === "ADMIN";

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
        <div className="mx-auto max-w-7xl">
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-white"
            >
                <ArrowLeft className="size-4" />
                Back to projects
            </Link>

            <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                    <div className="flex items-start gap-4">
                        <span
                            className="mt-1 size-5 shrink-0 rounded-full"
                            style={{
                                backgroundColor: project.color,
                            }}
                        />

                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    {project.name}
                                </h1>

                                <StatusBadge status={project.status} />
                            </div>

                            <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                                {project.description ??
                                    "No description has been added to this project."}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-500">
                                <span className="flex items-center gap-2">
                                    <CalendarDays className="size-4" />
                                    Created{" "}
                                    {format(project.createdAt, "MMM d, yyyy")}
                                </span>

                                <span>
                                    Owner: {project.owner.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    {project.ownerId === session.user.id ? (
                        <Link
                            href={`/projects/${project.id}/settings`}
                            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            <Settings className="size-4" />
                            Project settings
                        </Link>
                    ) : null}

                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-950 p-5">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <ListTodo className="size-4" />
                            Total tasks
                        </div>

                        <p className="mt-3 text-2xl font-bold">
                            {project._count.tasks}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-950 p-5">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Users className="size-4" />
                            Members
                        </div>

                        <p className="mt-3 text-2xl font-bold">
                            {project._count.members}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-950 p-5">
                        <p className="text-sm text-slate-500">
                            Progress
                        </p>

                        <p className="mt-3 text-2xl font-bold text-blue-400">
                            {progress}%
                        </p>
                    </div>
                </div>
            </section>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <section className="rounded-2xl border border-slate-800 bg-slate-900/70">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-6 py-5">
                        <div>
                            <h2 className="font-semibold">
                                Project tasks
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Tasks associated with this project
                            </p>
                        </div>

                        {canManageTasks ? (
                            <Link
                                href={`/projects/${project.id}/tasks/new`}
                                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500"
                            >
                                <Plus className="size-4" />
                                Add task
                            </Link>
                        ) : null}
                    </div>

                    {project.tasks.length > 0 ? (
                        <div className="divide-y divide-slate-800">
                            {project.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="px-6 py-5 transition hover:bg-slate-900"
                                >
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                        <div className="min-w-0">
                                            <p className="font-medium text-white">
                                                {task.title}
                                            </p>

                                            <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">
                                                {task.description ??
                                                    "No task description has been added."}
                                            </p>

                                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                                                <span>
                                                    Assignee:{" "}
                                                    {task.assignee?.name ?? "Unassigned"}
                                                </span>

                                                <span>
                                                    Due:{" "}
                                                    {task.dueDate
                                                        ? format(task.dueDate, "MMM d, yyyy")
                                                        : "No deadline"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                                            <PriorityBadge
                                                priority={task.priority}
                                            />

                                            <StatusBadge status={task.status} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-14 text-center text-sm text-slate-500">
                            No tasks have been created for this project.
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/70">
                    <div className="border-b border-slate-800 px-6 py-5">
                        <h2 className="font-semibold">
                            Project members
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            People with access to this project
                        </p>
                    </div>

                    <div className="divide-y divide-slate-800">
                        {project.members.map((member) => {
                            const initials = member.user.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase();

                            return (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3 px-6 py-4"
                                >
                                    <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold">
                                        {initials}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold">
                                            {member.user.name}
                                        </p>

                                        <p className="truncate text-xs text-slate-600">
                                            {member.user.email}
                                        </p>
                                    </div>

                                    <span className="text-xs font-semibold text-blue-400">
                                        {member.role}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}