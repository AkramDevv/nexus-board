"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "../../auth";
import { loginSchema } from "@/lib/validations/auth";

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