"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "../../auth";
import { prisma } from "@/lib/prisma";
import {
    createTaskSchema,
    deleteTaskSchema,
    updateTaskSchema,
    updateTaskStatusSchema,
} from "@/lib/validations/task";

export type CreateTaskActionState = {
    success: boolean;
    message: string;
    fieldErrors?: {
        projectId?: string[];
        title?: string[];
        description?: string[];
        priority?: string[];
        dueDate?: string[];
        assigneeId?: string[];
    };
};

export async function createTaskAction(
    _previousState: CreateTaskActionState,
    formData: FormData,
): Promise<CreateTaskActionState> {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            message: "You must be signed in to create a task.",
        };
    }

    const validationResult = createTaskSchema.safeParse({
        projectId: formData.get("projectId"),
        title: formData.get("title"),
        description: formData.get("description"),
        priority: formData.get("priority"),
        dueDate: formData.get("dueDate"),
        assigneeId: formData.get("assigneeId"),
    });

    if (!validationResult.success) {
        return {
            success: false,
            message: "Please correct the highlighted fields.",
            fieldErrors:
                validationResult.error.flatten().fieldErrors,
        };
    }

    const {
        projectId,
        title,
        description,
        priority,
        dueDate,
        assigneeId,
    } = validationResult.data;

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
        },
    });

    if (!project) {
        return {
            success: false,
            message:
                "Project not found or you do not have permission to create tasks.",
        };
    }

    if (assigneeId) {
        const assigneeMembership =
            await prisma.projectMember.findUnique({
                where: {
                    projectId_userId: {
                        projectId,
                        userId: assigneeId,
                    },
                },
            });

        if (!assigneeMembership) {
            return {
                success: false,
                message:
                    "The selected assignee is not a member of this project.",
            };
        }
    }

    let createdTaskId: string;

    try {
        const task = await prisma.task.create({
            data: {
                title,
                description: description || null,
                priority,
                dueDate: dueDate
                    ? new Date(`${dueDate}T23:59:59`)
                    : null,
                projectId,
                creatorId: session.user.id,
                assigneeId: assigneeId || null,
            },

            select: {
                id: true,
            },
        });

        createdTaskId = task.id;

        await prisma.activity.create({
            data: {
                type: "TASK_CREATED",
                message: `${session.user.name ?? "A user"} created the task "${title}".`,
                projectId,
                userId: session.user.id,
            },
        });
    } catch (error) {
        console.error("Task creation error:", error);

        return {
            success: false,
            message: "Task creation failed. Please try again.",
        };
    }

    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath(`/projects/${projectId}`);

    redirect(`/projects/${projectId}?taskCreated=${createdTaskId}`);
}

export type UpdateTaskActionState = {
    success: boolean;
    message: string;
    fieldErrors?: {
        taskId?: string[];
        projectId?: string[];
        title?: string[];
        description?: string[];
        priority?: string[];
        status?: string[];
        dueDate?: string[];
        assigneeId?: string[];
    };
};

export async function updateTaskAction(
    _previousState: UpdateTaskActionState,
    formData: FormData,
): Promise<UpdateTaskActionState> {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            message: "You must be signed in to update a task.",
        };
    }

    const validationResult = updateTaskSchema.safeParse({
        taskId: formData.get("taskId"),
        projectId: formData.get("projectId"),
        title: formData.get("title"),
        description: formData.get("description"),
        priority: formData.get("priority"),
        status: formData.get("status"),
        dueDate: formData.get("dueDate"),
        assigneeId: formData.get("assigneeId"),
    });

    if (!validationResult.success) {
        return {
            success: false,
            message: "Please correct the highlighted fields.",
            fieldErrors:
                validationResult.error.flatten().fieldErrors,
        };
    }

    const {
        taskId,
        projectId,
        title,
        description,
        priority,
        status,
        dueDate,
        assigneeId,
    } = validationResult.data;

    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            projectId,

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

        select: {
            id: true,
            projectId: true,
        },
    });

    if (!task) {
        return {
            success: false,
            message:
                "Task not found or you do not have permission to update it.",
        };
    }

    if (assigneeId) {
        const membership =
            await prisma.projectMember.findUnique({
                where: {
                    projectId_userId: {
                        projectId,
                        userId: assigneeId,
                    },
                },
            });

        if (!membership) {
            return {
                success: false,
                message:
                    "The selected assignee is not a member of this project.",
            };
        }
    }

    try {
        await prisma.task.update({
            where: {
                id: taskId,
            },

            data: {
                title,
                description: description || null,
                priority,
                status,
                dueDate: dueDate
                    ? new Date(`${dueDate}T23:59:59`)
                    : null,
                assigneeId: assigneeId || null,
            },
        });

        await prisma.activity.create({
            data: {
                type: "TASK_UPDATED",
                message: `${session.user.name ?? "A user"} updated the task "${title}".`,
                projectId,
                userId: session.user.id,
            },
        });
    } catch (error) {
        console.error("Task update error:", error);

        return {
            success: false,
            message: "Task update failed. Please try again.",
        };
    }

    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath(`/tasks/${taskId}`);
    revalidatePath(`/tasks/${taskId}/edit`);
    revalidatePath(`/projects/${projectId}`);

    return {
        success: true,
        message: "Task updated successfully.",
    };
}

export type UpdateTaskStatusActionState = {
    success: boolean;
    message: string;
};

export async function updateTaskStatusAction(
    _previousState: UpdateTaskStatusActionState,
    formData: FormData,
): Promise<UpdateTaskStatusActionState> {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            message: "You must be signed in to update task status.",
        };
    }

    const validationResult =
        updateTaskStatusSchema.safeParse({
            taskId: formData.get("taskId"),
            status: formData.get("status"),
        });

    if (!validationResult.success) {
        return {
            success: false,
            message: "Invalid task status.",
        };
    }

    const { taskId, status } = validationResult.data;

    const task = await prisma.task.findFirst({
        where: {
            id: taskId,

            OR: [
                {
                    assigneeId: session.user.id,
                },
                {
                    project: {
                        ownerId: session.user.id,
                    },
                },
                {
                    project: {
                        members: {
                            some: {
                                userId: session.user.id,
                                role: {
                                    in: ["OWNER", "ADMIN"],
                                },
                            },
                        },
                    },
                },
            ],
        },

        select: {
            id: true,
            title: true,
            projectId: true,
        },
    });

    if (!task) {
        return {
            success: false,
            message:
                "Task not found or you do not have permission to change its status.",
        };
    }

    try {
        await prisma.task.update({
            where: {
                id: task.id,
            },

            data: {
                status,
            },
        });

        await prisma.activity.create({
            data: {
                type: "TASK_STATUS_CHANGED",
                message: `${session.user.name ?? "A user"} changed "${task.title}" to ${status.replaceAll("_", " ").toLowerCase()}.`,
                projectId: task.projectId,
                userId: session.user.id,
            },
        });
    } catch (error) {
        console.error("Task status update error:", error);

        return {
            success: false,
            message: "Task status update failed.",
        };
    }

    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath(`/tasks/${task.id}`);
    revalidatePath(`/projects/${task.projectId}`);

    return {
        success: true,
        message: "Task status updated.",
    };
}

export type DeleteTaskActionState = {
    success: boolean;
    message: string;
};

export async function deleteTaskAction(
    _previousState: DeleteTaskActionState,
    formData: FormData,
): Promise<DeleteTaskActionState> {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            message: "You must be signed in to delete a task.",
        };
    }

    const validationResult = deleteTaskSchema.safeParse({
        taskId: formData.get("taskId"),
    });

    if (!validationResult.success) {
        return {
            success: false,
            message: "Invalid task information.",
        };
    }

    const { taskId } = validationResult.data;

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

        select: {
            id: true,
            title: true,
            projectId: true,
        },
    });

    if (!task) {
        return {
            success: false,
            message:
                "Task not found or you do not have permission to delete it.",
        };
    }

    try {
        await prisma.task.delete({
            where: {
                id: task.id,
            },
        });

        await prisma.activity.create({
            data: {
                type: "TASK_DELETED",
                message: `${session.user.name ?? "A user"} deleted the task "${task.title}".`,
                projectId: task.projectId,
                userId: session.user.id,
            },
        });
    } catch (error) {
        console.error("Task deletion error:", error);

        return {
            success: false,
            message: "Task deletion failed. Please try again.",
        };
    }

    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath(`/projects/${task.projectId}`);

    redirect(`/projects/${task.projectId}`);
}