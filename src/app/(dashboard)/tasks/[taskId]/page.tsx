import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    Edit3,
    FolderKanban,
    User,
} from "lucide-react";
import {
    format,
    formatDistanceToNow,
} from "date-fns";
import {
    notFound,
    redirect,
} from "next/navigation";

import { auth } from "../../../../../auth";
import { DeleteTaskForm } from "@/components/tasks/delete-task-form";
import { TaskStatusForm } from "@/components/tasks/task-status-form";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/prisma";
import { CommentForm } from "@/components/tasks/comment-form";
import { CommentItem } from "@/components/tasks/comment-item";

type TaskDetailsPageProps = {
    params: Promise<{
        taskId: string;
    }>;
};

export async function generateMetadata({
    params,
}: TaskDetailsPageProps): Promise<Metadata> {
    const { taskId } = await params;

    const task = await prisma.task.findUnique({
        where: {
            id: taskId,
        },
        select: {
            title: true,
        },
    });

    return {
        title: task?.title ?? "Task not found",
    };
}

export default async function TaskDetailsPage({
    params,
}: TaskDetailsPageProps) {
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
                            },
                        },
                    },
                ],
            },
        },

        include: {
            project: {
                include: {
                    members: {
                        where: {
                            userId: session.user.id,
                        },
                        select: {
                            role: true,
                        },
                    },
                },
            },

            assignee: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            creator: {
                select: {
                    name: true,
                    email: true,
                },
            },

            comments: {
                include: {
                    author: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },

                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!task) {
        notFound();
    }

    const membership = task.project.members[0];

    const canManageTask =
        task.project.ownerId === session.user.id ||
        membership?.role === "OWNER" ||
        membership?.role === "ADMIN";

    const canUpdateStatus =
        canManageTask ||
        task.assigneeId === session.user.id;

    return (
        <div className="mx-auto max-w-6xl">
            <Link
                href={`/projects/${task.project.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-white"
            >
                <ArrowLeft className="size-4" />
                Back to project
            </Link>

            <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <StatusBadge status={task.status} />
                            <PriorityBadge priority={task.priority} />
                        </div>

                        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                            {task.title}
                        </h1>

                        <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                            {task.description ??
                                "No description has been added to this task."}
                        </p>
                    </div>

                    {canManageTask ? (
                        <Link
                            href={`/tasks/${task.id}/edit`}
                            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            <Edit3 className="size-4" />
                            Edit task
                        </Link>
                    ) : null}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl bg-slate-950 p-5">
                        <FolderKanban className="size-4 text-blue-400" />

                        <p className="mt-3 text-xs uppercase tracking-wider text-slate-600">
                            Project
                        </p>

                        <Link
                            href={`/projects/${task.project.id}`}
                            className="mt-1 block font-semibold text-white hover:text-blue-400"
                        >
                            {task.project.name}
                        </Link>
                    </div>

                    <div className="rounded-xl bg-slate-950 p-5">
                        <User className="size-4 text-violet-400" />

                        <p className="mt-3 text-xs uppercase tracking-wider text-slate-600">
                            Assignee
                        </p>

                        <p className="mt-1 font-semibold text-white">
                            {task.assignee?.name ?? "Unassigned"}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-950 p-5">
                        <CalendarDays className="size-4 text-amber-400" />

                        <p className="mt-3 text-xs uppercase tracking-wider text-slate-600">
                            Due date
                        </p>

                        <p className="mt-1 font-semibold text-white">
                            {task.dueDate
                                ? format(task.dueDate, "MMM d, yyyy")
                                : "No deadline"}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-950 p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-600">
                            Created by
                        </p>

                        <p className="mt-3 font-semibold text-white">
                            {task.creator.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                            {formatDistanceToNow(task.createdAt, {
                                addSuffix: true,
                            })}
                        </p>
                    </div>
                </div>
            </section>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                    <h2 className="font-semibold text-white">
                        Task status
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Update the current workflow stage.
                    </p>

                    <div className="mt-5">
                        {canUpdateStatus ? (
                            <TaskStatusForm
                                taskId={task.id}
                                currentStatus={task.status}
                            />
                        ) : (
                            <p className="rounded-xl bg-slate-950 p-4 text-sm text-slate-500">
                                Only project managers or the assigned member
                                can change this status.
                            </p>
                        )}
                    </div>
                </section>

                {canManageTask ? (
                    <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                        <h2 className="font-semibold text-white">
                            Danger zone
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Permanently delete this task and its comments.
                        </p>

                        <div className="mt-5">
                            <DeleteTaskForm
                                taskId={task.id}
                                taskTitle={task.title}
                            />
                        </div>
                    </section>
                ) : null}

                <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="font-semibold text-white">
                                Discussion
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Collaborate with project members on this task.
                            </p>
                        </div>

                        <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-400">
                            {task.comments.length}{" "}
                            {task.comments.length === 1
                                ? "comment"
                                : "comments"}
                        </span>
                    </div>

                    <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
                        <CommentForm taskId={task.id} />
                    </div>

                    <div className="mt-6">
                        {task.comments.length > 0 ? (
                            task.comments.map((comment) => {
                                const canDeleteComment =
                                    comment.authorId === session.user.id ||
                                    canManageTask;

                                return (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        canDelete={canDeleteComment}
                                    />
                                );
                            })
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-800 px-6 py-12 text-center">
                                <p className="font-medium text-slate-300">
                                    No comments yet
                                </p>

                                <p className="mt-1 text-sm text-slate-600">
                                    Start the discussion by writing the first
                                    comment.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}