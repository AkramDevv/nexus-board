"use client";

import { useActionState } from "react";
import {
  CalendarDays,
  LoaderCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";

import {
  createTaskAction,
  type CreateTaskActionState,
} from "@/actions/task-actions";

const initialState: CreateTaskActionState = {
  success: false,
  message: "",
};

type CreateTaskFormProps = {
  project: {
    id: string;
    name: string;
    members: {
      user: {
        id: string;
        name: string;
        email: string;
      };
    }[];
  };
};

export function CreateTaskForm({
  project,
}: CreateTaskFormProps) {
  const [state, formAction, isPending] = useActionState(
    createTaskAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input
        type="hidden"
        name="projectId"
        value={project.id}
      />

      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Project
        </p>

        <p className="mt-1 font-semibold text-white">
          {project.name}
        </p>
      </div>

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
          type="text"
          placeholder="e.g. Build project dashboard"
          disabled={isPending}
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        />

        {state.fieldErrors?.title?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.title[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-200"
          >
            Description
          </label>

          <span className="text-xs text-slate-600">
            Optional
          </span>
        </div>

        <textarea
          id="description"
          name="description"
          rows={5}
          placeholder="Describe what needs to be completed..."
          disabled={isPending}
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        />

        {state.fieldErrors?.description?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.description[0]}
          </p>
        ) : null}
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
            defaultValue="MEDIUM"
            disabled={isPending}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {state.fieldErrors?.priority?.[0] ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.priority[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="dueDate"
            className="text-sm font-medium text-slate-200"
          >
            Due date
          </label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-600" />

            <input
              id="dueDate"
              name="dueDate"
              type="date"
              disabled={isPending}
              className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
            />
          </div>

          {state.fieldErrors?.dueDate?.[0] ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.dueDate[0]}
            </p>
          ) : null}
        </div>
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
          defaultValue=""
          disabled={isPending}
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        >
          <option value="">Unassigned</option>

          {project.members.map((member) => (
            <option
              key={member.user.id}
              value={member.user.id}
            >
              {member.user.name} — {member.user.email}
            </option>
          ))}
        </select>

        {state.fieldErrors?.assigneeId?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.assigneeId[0]}
          </p>
        ) : null}
      </div>

      {state.message && !state.fieldErrors ? (
        <div
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {state.message}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-700 px-5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Creating task...
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Create task
            </>
          )}
        </button>
      </div>
    </form>
  );
}