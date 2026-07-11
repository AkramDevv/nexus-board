import { z } from "zod";

export const projectStatusSchema = z.enum([
  "ACTIVE",
  "COMPLETED",
  "ARCHIVED",
]);

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must contain at least 2 characters.")
    .max(80, "Project name cannot exceed 80 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),

  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Select a valid project color."),
});

export const updateProjectSchema = createProjectSchema.extend({
  projectId: z.string().min(1, "Project ID is required."),
  status: projectStatusSchema,
});

export const deleteProjectSchema = z.object({
  projectId: z.string().min(1, "Project ID is required."),
});

export type CreateProjectInput = z.infer<
  typeof createProjectSchema
>;

export type UpdateProjectInput = z.infer<
  typeof updateProjectSchema
>;