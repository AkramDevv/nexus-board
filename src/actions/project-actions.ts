"use server";

import { MemberRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "../../auth";
import { prisma } from "@/lib/prisma";
import { createProjectSchema } from "@/lib/validations/project";

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