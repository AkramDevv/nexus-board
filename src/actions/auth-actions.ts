"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "../../auth";
import {
  loginSchema,
  registerSchema,
} from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export type LoginActionState = {
  success: boolean;
  message: string;
};

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const validationResult = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationResult.success) {
    return {
      success: false,
      message:
        validationResult.error.issues[0]?.message ??
        "Please check the entered information.",
    };
  }

  try {
    await signIn("credentials", {
      email: validationResult.data.email,
      password: validationResult.data.password,
      redirectTo: "/dashboard",
    });

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return {
          success: false,
          message: "Email or password is incorrect.",
        };
      }

      return {
        success: false,
        message: "Authentication failed. Please try again.",
      };
    }

    throw error;
  }
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/login",
  });
}

export type RegisterActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
};

export async function registerAction(
  _previousState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const validationResult = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validationResult.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validationResult.data;
  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: "An account with this email already exists.",
      fieldErrors: {
        email: ["This email address is already registered."],
      },
    };
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return {
      success: false,
      message: "Account creation failed. Please try again.",
    };
  }

  redirect("/login?registered=true");
}