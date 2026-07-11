"use server";

import { revalidatePath } from "next/cache";

import { auth } from "../../auth";
import { prisma } from "@/lib/prisma";
import {
  createCommentSchema,
  deleteCommentSchema,
} from "@/lib/validations/comment";

export type CreateCommentActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    taskId?: string[];
    content?: string[];
  };
};

export async function createCommentAction(
  _previousState: CreateCommentActionState,
  formData: FormData,
): Promise<CreateCommentActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "You must be signed in to add a comment.",
    };
  }

  const validationResult = createCommentSchema.safeParse({
    taskId: formData.get("taskId"),
    content: formData.get("content"),
  });

  if (!validationResult.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors:
        validationResult.error.flatten().fieldErrors,
    };
  }

  const { taskId, content } = validationResult.data;

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
        "Task not found or you do not have permission to comment.",
    };
  }

  try {
    await prisma.comment.create({
      data: {
        content,
        taskId,
        authorId: session.user.id,
      },
    });

    await prisma.activity.create({
      data: {
        type: "COMMENT_ADDED",
        message: `${session.user.name ?? "A user"} commented on "${task.title}".`,
        projectId: task.projectId,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error("Comment creation error:", error);

    return {
      success: false,
      message: "Comment could not be added. Please try again.",
    };
  }

  revalidatePath(`/tasks/${taskId}`);
  revalidatePath("/activity");

  return {
    success: true,
    message: "Comment added successfully.",
  };
}

export type DeleteCommentActionState = {
  success: boolean;
  message: string;
};

export async function deleteCommentAction(
  _previousState: DeleteCommentActionState,
  formData: FormData,
): Promise<DeleteCommentActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "You must be signed in.",
    };
  }

  const validationResult = deleteCommentSchema.safeParse({
    commentId: formData.get("commentId"),
  });

  if (!validationResult.success) {
    return {
      success: false,
      message: "Invalid comment information.",
    };
  }

  const { commentId } = validationResult.data;

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,

      task: {
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
    },

    include: {
      task: {
        select: {
          id: true,
          projectId: true,

          project: {
            select: {
              ownerId: true,

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
        },
      },
    },
  });

  if (!comment) {
    return {
      success: false,
      message: "Comment was not found.",
    };
  }

  const membership = comment.task.project.members[0];

  const canDelete =
    comment.authorId === session.user.id ||
    comment.task.project.ownerId === session.user.id ||
    membership?.role === "OWNER" ||
    membership?.role === "ADMIN";

  if (!canDelete) {
    return {
      success: false,
      message:
        "You do not have permission to delete this comment.",
    };
  }

  try {
    await prisma.comment.delete({
      where: {
        id: comment.id,
      },
    });
  } catch (error) {
    console.error("Comment deletion error:", error);

    return {
      success: false,
      message: "Comment could not be deleted.",
    };
  }

  revalidatePath(`/tasks/${comment.task.id}`);

  return {
    success: true,
    message: "Comment deleted.",
  };
}