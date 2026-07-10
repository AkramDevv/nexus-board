import { z } from "zod";

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

export type CreateProjectInput = z.infer<
  typeof createProjectSchema
>;