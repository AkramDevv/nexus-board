"use server";

import { MemberRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "../../auth";
import { prisma } from "@/lib/prisma";
import {
    createProjectSchema,
    deleteProjectSchema,
    updateProjectSchema,
} from "@/lib/validations/project";

export type CreateProjectActionState = {
    success: boolean;
    message: string;
    fieldErrors?: {
        name?: string[];
        description?: string[];
        color?: string[];
    };
};

export async function createProjectAction(
    _previousState: CreateProjectActionState,
    formData: FormData,
): Promise<CreateProjectActionState> {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            message: "You must be signed in to create a project.",
        };
    }

    const validationResult = createProjectSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        color: formData.get("color"),
    });

    if (!validationResult.success) {
        return {
            success: false,
            message: "Please correct the highlighted fields.",
            fieldErrors: validationResult.error.flatten().fieldErrors,
        };
    }

    const { name, description, color } = validationResult.data;

    let createdProjectId: string;

    try {
        const project = await prisma.project.create({
            data: {
                name,
                description: description || null,
                color,
                ownerId: session.user.id,

                members: {
                    create: {
                        userId: session.user.id,
                        role: MemberRole.OWNER,
                    },
                },

                activities: {
                    create: {
                        type: "PROJECT_CREATED",
                        message: `${session.user.name ?? "A user"} created the ${name} project.`,
                        userId: session.user.id,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        createdProjectId = project.id;
    } catch (error) {
        console.error("Project creation error:", error);

        return {
            success: false,
            message: "Project creation failed. Please try again.",
        };
    }

    revalidatePath("/dashboard");
    revalidatePath("/projects");

    redirect(`/projects/${createdProjectId}`);
}

export type UpdateProjectActionState = {
    success: boolean;
    message: string;
    fieldErrors?: {
        name?: string[];
        description?: string[];
        color?: string[];
        status?: string[];
        projectId?: string[];
    };
};

export async function updateProjectAction(
    _previousState: UpdateProjectActionState,
    formData: FormData,
): Promise<UpdateProjectActionState> {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            message: "You must be signed in to update a project.",
        };
    }

    const validationResult = updateProjectSchema.safeParse({
        projectId: formData.get("projectId"),
        name: formData.get("name"),
        description: formData.get("description"),
        color: formData.get("color"),
        status: formData.get("status"),
    });

    if (!validationResult.success) {
        return {
            success: false,
            message: "Please correct the highlighted fields.",
            fieldErrors: validationResult.error.flatten().fieldErrors,
        };
    }

    const {
        projectId,
        name,
        description,
        color,
        status,
    } = validationResult.data;

    const ownedProject = await prisma.project.findFirst({
        where: {
            id: projectId,
            ownerId: session.user.id,
        },
        select: {
            id: true,
            name: true,
            status: true,
        },
    });

    if (!ownedProject) {
        return {
            success: false,
            message:
                "Project not found or you do not have permission to update it.",
        };
    }

    try {
        await prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                name,
                description: description || null,
                color,
                status,

                activities: {
                    create: {
                        type: "PROJECT_UPDATED",
                        message: `${session.user.name ?? "A user"} updated the ${name} project.`,
                        userId: session.user.id,
                    },
                },
            },
        });
    } catch (error) {
        console.error("Project update error:", error);

        return {
            success: false,
            message: "Project update failed. Please try again.",
        };
    }

    revalidatePath("/dashboard");
    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/settings`);

    return {
        success: true,
        message: "Project updated successfully.",
    };
}

export type DeleteProjectActionState = {
    success: boolean;
    message: string;
};

export async function deleteProjectAction(
    _previousState: DeleteProjectActionState,
    formData: FormData,
): Promise<DeleteProjectActionState> {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            message: "You must be signed in to delete a project.",
        };
    }

    const validationResult = deleteProjectSchema.safeParse({
        projectId: formData.get("projectId"),
    });

    if (!validationResult.success) {
        return {
            success: false,
            message: "Invalid project information.",
        };
    }

    const { projectId } = validationResult.data;

    const ownedProject = await prisma.project.findFirst({
        where: {
            id: projectId,
            ownerId: session.user.id,
        },
        select: {
            id: true,
            name: true,
        },
    });

    if (!ownedProject) {
        return {
            success: false,
            message:
                "Project not found or you do not have permission to delete it.",
        };
    }

    try {
        await prisma.project.delete({
            where: {
                id: projectId,
            },
        });
    } catch (error) {
        console.error("Project deletion error:", error);

        return {
            success: false,
            message: "Project deletion failed. Please try again.",
        };
    }

    revalidatePath("/dashboard");
    revalidatePath("/projects");

    redirect("/projects");
}