"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "../../auth";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validations/task";

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