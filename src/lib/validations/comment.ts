import { z } from "zod";

export const createCommentSchema = z.object({
  taskId: z.string().min(1, "Task ID is required."),

  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty.")
    .max(1000, "Comment cannot exceed 1000 characters."),
});

export const deleteCommentSchema = z.object({
  commentId: z.string().min(1, "Comment ID is required."),
});