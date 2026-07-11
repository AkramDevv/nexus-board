"use server";

import { revalidatePath } from "next/cache";

import { auth } from "../../auth";
import { prisma } from "@/lib/prisma";
import {
  addProjectMemberSchema,
  removeProjectMemberSchema,
  updateProjectMemberRoleSchema,
} from "@/lib/validations/member";

export type AddProjectMemberActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    projectId?: string[];
    email?: string[];
    role?: string[];
  };
};

export async function addProjectMemberAction(
  _previousState: AddProjectMemberActionState,
  formData: FormData,
): Promise<AddProjectMemberActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "You must be signed in to add members.",
    };
  }

  const validationResult =
    addProjectMemberSchema.safeParse({
      projectId: formData.get("projectId"),
      email: formData.get("email"),
      role: formData.get("role"),
    });

  if (!validationResult.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors:
        validationResult.error.flatten().fieldErrors,
    };
  }

  const { projectId, email, role } =
    validationResult.data;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
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
        "Project not found or you do not have permission to manage members.",
    };
  }

  const normalizedEmail = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },

    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    return {
      success: false,
      message:
        "No NexusBoard account was found with this email address.",
      fieldErrors: {
        email: [
          "The user must register before being added to a project.",
        ],
      },
    };
  }

  if (user.id === session.user.id) {
    return {
      success: false,
      message:
        "You are already the owner of this project.",
    };
  }

  const existingMembership =
    await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.id,
        },
      },
    });

  if (existingMembership) {
    return {
      success: false,
      message:
        "This user is already a member of the project.",
      fieldErrors: {
        email: [
          "This account already has access to the project.",
        ],
      },
    };
  }

  try {
    await prisma.projectMember.create({
      data: {
        projectId,
        userId: user.id,
        role,
      },
    });

    await prisma.activity.create({
      data: {
        type: "MEMBER_ADDED",
        message: `${session.user.name ?? "A user"} added ${user.name} to the project as ${role.toLowerCase()}.`,
        projectId,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error("Member addition error:", error);

    return {
      success: false,
      message:
        "The member could not be added. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/settings`);

  return {
    success: true,
    message: `${user.name} was added successfully.`,
  };
}

export type UpdateMemberRoleActionState = {
  success: boolean;
  message: string;
};

export async function updateProjectMemberRoleAction(
  _previousState: UpdateMemberRoleActionState,
  formData: FormData,
): Promise<UpdateMemberRoleActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "You must be signed in.",
    };
  }

  const validationResult =
    updateProjectMemberRoleSchema.safeParse({
      projectId: formData.get("projectId"),
      memberId: formData.get("memberId"),
      role: formData.get("role"),
    });

  if (!validationResult.success) {
    return {
      success: false,
      message: "Invalid member information.",
    };
  }

  const { projectId, memberId, role } =
    validationResult.data;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },

    select: {
      id: true,
    },
  });

  if (!project) {
    return {
      success: false,
      message:
        "You do not have permission to manage this project.",
    };
  }

  const membership =
    await prisma.projectMember.findFirst({
      where: {
        id: memberId,
        projectId,
      },

      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

  if (!membership) {
    return {
      success: false,
      message: "Project member was not found.",
    };
  }

  if (membership.role === "OWNER") {
    return {
      success: false,
      message: "The project owner role cannot be changed.",
    };
  }

  try {
    await prisma.projectMember.update({
      where: {
        id: membership.id,
      },

      data: {
        role,
      },
    });

    await prisma.activity.create({
      data: {
        type: "MEMBER_ROLE_UPDATED",
        message: `${session.user.name ?? "A user"} changed ${membership.user.name}'s project role to ${role.toLowerCase()}.`,
        projectId,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error("Member role update error:", error);

    return {
      success: false,
      message: "The member role could not be updated.",
    };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/settings`);

  return {
    success: true,
    message: `${membership.user.name}'s role was updated.`,
  };
}

export type RemoveProjectMemberActionState = {
  success: boolean;
  message: string;
};

export async function removeProjectMemberAction(
  _previousState: RemoveProjectMemberActionState,
  formData: FormData,
): Promise<RemoveProjectMemberActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "You must be signed in.",
    };
  }

  const validationResult =
    removeProjectMemberSchema.safeParse({
      projectId: formData.get("projectId"),
      memberId: formData.get("memberId"),
    });

  if (!validationResult.success) {
    return {
      success: false,
      message: "Invalid member information.",
    };
  }

  const { projectId, memberId } =
    validationResult.data;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },

    select: {
      id: true,
    },
  });

  if (!project) {
    return {
      success: false,
      message:
        "You do not have permission to manage this project.",
    };
  }

  const membership =
    await prisma.projectMember.findFirst({
      where: {
        id: memberId,
        projectId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

  if (!membership) {
    return {
      success: false,
      message: "Project member was not found.",
    };
  }

  if (membership.role === "OWNER") {
    return {
      success: false,
      message: "The project owner cannot be removed.",
    };
  }

  try {
    await prisma.$transaction([
      prisma.task.updateMany({
        where: {
          projectId,
          assigneeId: membership.user.id,
        },

        data: {
          assigneeId: null,
        },
      }),

      prisma.projectMember.delete({
        where: {
          id: membership.id,
        },
      }),

      prisma.activity.create({
        data: {
          type: "MEMBER_REMOVED",
          message: `${session.user.name ?? "A user"} removed ${membership.user.name} from the project.`,
          projectId,
          userId: session.user.id,
        },
      }),
    ]);
  } catch (error) {
    console.error("Member removal error:", error);

    return {
      success: false,
      message: "The project member could not be removed.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/settings`);

  return {
    success: true,
    message: `${membership.user.name} was removed from the project.`,
  };
}