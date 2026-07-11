import { z } from "zod";

export const memberRoleSchema = z.enum([
  "ADMIN",
  "MEMBER",
]);

export const addProjectMemberSchema = z.object({
  projectId: z.string().min(1, "Project ID is required."),

  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),

  role: memberRoleSchema,
});

export const updateProjectMemberRoleSchema = z.object({
  projectId: z.string().min(1, "Project ID is required."),
  memberId: z.string().min(1, "Member ID is required."),
  role: memberRoleSchema,
});

export const removeProjectMemberSchema = z.object({
  projectId: z.string().min(1, "Project ID is required."),
  memberId: z.string().min(1, "Member ID is required."),
});