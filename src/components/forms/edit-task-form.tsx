"use client";

import { useActionState } from "react";
import {
  CheckCircle2,
  LoaderCircle,
  Save,
} from "lucide-react";
import Link from "next/link";

import {
  updateTaskAction,
  type UpdateTaskActionState,
} from "@/actions/task-actions";

const initialState: UpdateTaskActionState = {
  success: false,
  message: "",
};

type EditTaskFormProps = {
  task: {
    id: string;
    projectId: string;
    title: string;
    description: string | null;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    status:
      | "TODO"
      | "IN_PROGRESS"
      | "REVIEW"
      | "DONE";
    dueDate: Date | null;
    assigneeId: string | null;
  };

  members: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
};

export function EditTaskForm({
  task,
  members,
}: EditTaskFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateTaskAction,
    initialState,
  );

  const dueDateValue = task.dueDate
    ? task.dueDate.toISOString().split("T")[0]
    : "";

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="taskId" value={task.id} />
      <input
        type="hidden"
        name="projectId"
        value={task.projectId}
      />

      <div className="space-y-2">
        <label
          htmlFor="title"
          className="text-sm font-medium text-slate-200"
        >
          Task title
        </label>

        <input
          id="title"
          name="title"
          defaultValue={task.title}
          disabled={isPending}
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white outline-none focus:border-blue-500 disabled:opacity-60"
        />

        {state.fieldErrors?.title?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.title[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-slate-200"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={task.description ?? ""}
          disabled={isPending}
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 disabled:opacity-60"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="priority"
            className="text-sm font-medium text-slate-200"
          >
            Priority
          </label>

          <select
            id="priority"
            name="priority"
            defaultValue={task.priority}
            disabled={isPending}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="status"
            className="text-sm font-medium text-slate-200"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            defaultValue={task.status}
            disabled={isPending}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white"
          >
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">
              In progress
            </option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="dueDate"
            className="text-sm font-medium text-slate-200"
          >
            Due date
          </label>

          <input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={dueDateValue}
            disabled={isPending}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="assigneeId"
            className="text-sm font-medium text-slate-200"
          >
            Assignee
          </label>

          <select
            id="assigneeId"
            name="assigneeId"
            defaultValue={task.assigneeId ?? ""}
            disabled={isPending}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white"
          >
            <option value="">Unassigned</option>

            {members.map((member) => (
              <option
                key={member.user.id}
                value={member.user.id}
              >
                {member.user.name} — {member.user.email}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state.message ? (
        <div
          className={
            state.success
              ? "flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
              : "rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          }
        >
          {state.success ? (
            <CheckCircle2 className="size-4" />
          ) : null}

          {state.message}
        </div>
      ) : null}

      <div className="flex justify-end gap-3 border-t border-slate-800 pt-6">
        <Link
          href={`/tasks/${task.id}`}
          className="inline-flex h-11 items-center rounded-xl border border-slate-700 px-5 text-sm font-semibold text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}