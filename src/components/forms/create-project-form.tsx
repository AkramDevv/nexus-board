"use client";

import { useActionState } from "react";
import {
  ArrowLeft,
  FolderPlus,
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";

import {
  createProjectAction,
  type CreateProjectActionState,
} from "@/actions/project-actions";

const initialState: CreateProjectActionState = {
  success: false,
  message: "",
};

const projectColors = [
  "#2563EB",
  "#7C3AED",
  "#059669",
  "#EA580C",
  "#DC2626",
  "#0891B2",
  "#DB2777",
  "#4F46E5",
];

export function CreateProjectForm() {
  const [state, formAction, isPending] = useActionState(
    createProjectAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium text-slate-200"
        >
          Project name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          placeholder="e.g. Customer Portal"
          disabled={isPending}
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        />

        {state.fieldErrors?.name?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.name[0]}
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
          placeholder="Describe the purpose and goals of this project..."
          disabled={isPending}
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        />

        {state.fieldErrors?.description?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.description[0]}
          </p>
        ) : null}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-200">
          Project color
        </legend>

        <div className="flex flex-wrap gap-3">
          {projectColors.map((color, index) => (
            <label
              key={color}
              className="cursor-pointer"
              title={color}
            >
              <input
                type="radio"
                name="color"
                value={color}
                defaultChecked={index === 0}
                disabled={isPending}
                className="peer sr-only"
              />

              <span
                className="block size-10 rounded-xl border-2 border-transparent transition peer-checked:border-white peer-checked:ring-4 peer-checked:ring-white/10"
                style={{
                  backgroundColor: color,
                }}
              />
            </label>
          ))}
        </div>

        {state.fieldErrors?.color?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.color[0]}
          </p>
        ) : null}
      </fieldset>

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
          href="/projects"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft className="size-4" />
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
              Creating project...
            </>
          ) : (
            <>
              <FolderPlus className="size-4" />
              Create project
            </>
          )}
        </button>
      </div>
    </form>
  );
}