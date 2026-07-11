import { z } from "zod";

export const taskStatusSchema = z.enum([
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
]);

export const taskPrioritySchema = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);

export const createTaskSchema = z.object({
  projectId: z.string().min(1, "Project ID is required."),

  title: z
    .string()
    .trim()
    .min(2, "Task title must contain at least 2 characters.")
    .max(120, "Task title cannot exceed 120 characters."),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters.")
    .optional(),

  priority: taskPrioritySchema,

  dueDate: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        const date = new Date(value);

        return !Number.isNaN(date.getTime());
      },
      {
        message: "Enter a valid due date.",
      },
    ),

  assigneeId: z.string().optional(),
});

export type CreateTaskInput = z.infer<
  typeof createTaskSchema
>;