import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    FolderKanban,
    ListTodo,
    Plus,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

import { auth } from "../../../../auth";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/prisma";
import { WorkspaceCharts } from "@/components/dashboard/workspace-charts";

export const metadata: Metadata = {
    title: "Dashboard",
    description:
        "View your NexusBoard workspace overview and recent activity.",
};

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const accessibleProjects = await prisma.project.findMany({
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

    const [
        totalProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        recentProjects,
        recentTasks,
        taskStatusGroups,
        taskPriorityGroups,
        chartProjects,
    ] = await Promise.all([
        prisma.project.count({
            where: {
                id: {
                    in: projectIds,
                },
            },
        }),

        prisma.project.count({
            where: {
                id: {
                    in: projectIds,
                },
                status: "COMPLETED",
            },
        }),

        prisma.task.count({
            where: {
                projectId: {
                    in: projectIds,
                },
            },
        }),

        prisma.task.count({
            where: {
                projectId: {
                    in: projectIds,
                },
                status: "DONE",
            },
        }),

        prisma.project.findMany({
            where: {
                id: {
                    in: projectIds,
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            take: 4,
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
        }),

        prisma.task.findMany({
            where: {
                projectId: {
                    in: projectIds,
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            take: 5,
            include: {
                project: {
                    select: {
                        name: true,
                        color: true,
                    },
                },
                assignee: {
                    select: {
                        name: true,
                    },
                },
            },
        }),

        prisma.task.groupBy({
            by: ["status"],

            where: {
                projectId: {
                    in: projectIds,
                },
            },

            _count: {
                _all: true,
            },
        }),

        prisma.task.groupBy({
            by: ["priority"],

            where: {
                projectId: {
                    in: projectIds,
                },
            },

            _count: {
                _all: true,
            },
        }),

        prisma.project.findMany({
            where: {
                id: {
                    in: projectIds,
                },
            },

            orderBy: {
                updatedAt: "desc",
            },

            take: 6,

            select: {
                name: true,

                tasks: {
                    select: {
                        status: true,
                    },
                },
            },
        }),
    ]);

    const pendingTasks = totalTasks - completedTasks;

    const statusCounts = new Map(
        taskStatusGroups.map((item) => [
            item.status,
            item._count._all,
        ]),
    );

    const statusData = [
        {
            name: "To do",
            value: statusCounts.get("TODO") ?? 0,
            color: "#64748b",
        },
        {
            name: "In progress",
            value: statusCounts.get("IN_PROGRESS") ?? 0,
            color: "#2563eb",
        },
        {
            name: "Review",
            value: statusCounts.get("REVIEW") ?? 0,
            color: "#f59e0b",
        },
        {
            name: "Done",
            value: statusCounts.get("DONE") ?? 0,
            color: "#10b981",
        },
    ];

    const priorityCounts = new Map(
        taskPriorityGroups.map((item) => [
            item.priority,
            item._count._all,
        ]),
    );

    const priorityData = [
        {
            name: "Low",
            value: priorityCounts.get("LOW") ?? 0,
        },
        {
            name: "Medium",
            value: priorityCounts.get("MEDIUM") ?? 0,
        },
        {
            name: "High",
            value: priorityCounts.get("HIGH") ?? 0,
        },
        {
            name: "Urgent",
            value: priorityCounts.get("URGENT") ?? 0,
        },
    ];

    const projectProgressData = chartProjects.map(
        (project) => {
            const completedCount = project.tasks.filter(
                (task) => task.status === "DONE",
            ).length;

            const progress =
                project.tasks.length === 0
                    ? 0
                    : Math.round(
                        (completedCount /
                            project.tasks.length) *
                        100,
                    );

            return {
                name:
                    project.name.length > 20
                        ? `${project.name.slice(0, 20)}…`
                        : project.name,
                progress,
            };
        },
    );

    return (
        <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-semibold text-blue-400">
                        Workspace overview
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Track projects, tasks, deadlines, and team progress.
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

            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total projects"
                    value={totalProjects}
                    change={12}
                    description="from last month"
                    icon={FolderKanban}
                />

                <StatCard
                    title="Total tasks"
                    value={totalTasks}
                    change={18}
                    description="from last month"
                    icon={ListTodo}
                />

                <StatCard
                    title="Completed tasks"
                    value={completedTasks}
                    change={24}
                    description="from last month"
                    icon={CheckCircle2}
                />

                <StatCard
                    title="Pending tasks"
                    value={pendingTasks}
                    change={-6}
                    description="from last month"
                    icon={Clock3}
                />
            </section>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <section className="rounded-2xl border border-slate-800 bg-slate-900/70">
                    <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5 sm:px-6">
                        <div>
                            <h2 className="font-semibold text-white">
                                Recent projects
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Your most recently updated projects
                            </p>
                        </div>

                        <Link
                            href="/projects"
                            className="flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-blue-300"
                        >
                            View all
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    {recentProjects.length > 0 ? (
                        <div className="divide-y divide-slate-800">
                            {recentProjects.map((project) => {
                                const completedTaskCount =
                                    project.tasks.filter(
                                        (task) => task.status === "DONE",
                                    ).length;

                                const progress =
                                    project._count.tasks === 0
                                        ? 0
                                        : Math.round(
                                            (completedTaskCount /
                                                project._count.tasks) *
                                            100,
                                        );

                                return (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.id}`}
                                        className="block px-5 py-5 transition hover:bg-slate-900 sm:px-6"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 items-start gap-3">
                                                <span
                                                    className="mt-1 size-3 shrink-0 rounded-full"
                                                    style={{
                                                        backgroundColor: project.color,
                                                    }}
                                                />

                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h3 className="truncate font-semibold text-white">
                                                            {project.name}
                                                        </h3>

                                                        <StatusBadge
                                                            status={project.status}
                                                        />
                                                    </div>

                                                    <p className="mt-2 text-sm text-slate-500">
                                                        {project._count.tasks} tasks ·{" "}
                                                        {project._count.members} members
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="text-sm font-semibold text-slate-300">
                                                {progress}%
                                            </span>
                                        </div>

                                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${progress}%`,
                                                    backgroundColor: project.color,
                                                }}
                                            />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="px-6 py-14 text-center">
                            <FolderKanban className="mx-auto size-10 text-slate-700" />

                            <p className="mt-4 font-medium text-slate-300">
                                No projects yet
                            </p>

                            <p className="mt-1 text-sm text-slate-600">
                                Create your first project to begin.
                            </p>
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/70">
                    <div className="border-b border-slate-800 px-5 py-5">
                        <h2 className="font-semibold text-white">
                            Workspace summary
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Current project performance
                        </p>
                    </div>

                    <div className="space-y-5 p-5">
                        <div className="flex items-center justify-between rounded-xl bg-slate-950 p-4">
                            <span className="text-sm text-slate-400">
                                Active projects
                            </span>

                            <span className="font-bold text-white">
                                {totalProjects - completedProjects}
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-slate-950 p-4">
                            <span className="text-sm text-slate-400">
                                Completed projects
                            </span>

                            <span className="font-bold text-emerald-400">
                                {completedProjects}
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-slate-950 p-4">
                            <span className="text-sm text-slate-400">
                                Task completion
                            </span>

                            <span className="font-bold text-blue-400">
                                {totalTasks === 0
                                    ? 0
                                    : Math.round(
                                        (completedTasks / totalTasks) * 100,
                                    )}
                                %
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            <WorkspaceCharts
                statusData={statusData}
                priorityData={priorityData}
                projectProgressData={projectProgressData}
            />

            <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70">
                <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5 sm:px-6">
                    <div>
                        <h2 className="font-semibold text-white">
                            Recent tasks
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Latest task activity across your projects
                        </p>
                    </div>

                    <Link
                        href="/tasks"
                        className="flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-blue-300"
                    >
                        View all
                        <ArrowRight className="size-4" />
                    </Link>
                </div>

                {recentTasks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left">
                            <thead>
                                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-600">
                                    <th className="px-6 py-4 font-semibold">
                                        Task
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Project
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Assignee
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Due date
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-800">
                                {recentTasks.map((task) => (
                                    <tr
                                        key={task.id}
                                        className="transition hover:bg-slate-900"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-white">
                                                {task.title}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-600">
                                                Updated{" "}
                                                {formatDistanceToNow(task.updatedAt, {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                                <span
                                                    className="size-2.5 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            task.project.color,
                                                    }}
                                                />

                                                {task.project.name}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {task.assignee?.name ?? "Unassigned"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {task.dueDate
                                                ? format(task.dueDate, "MMM d, yyyy")
                                                : "No deadline"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <StatusBadge status={task.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-6 py-14 text-center">
                        <ListTodo className="mx-auto size-10 text-slate-700" />

                        <p className="mt-4 font-medium text-slate-300">
                            No tasks found
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                            Tasks from your projects will appear here.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}