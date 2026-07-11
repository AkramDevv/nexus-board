"use client";

import { useActionState } from "react";
import {
  CheckCircle2,
  LoaderCircle,
  Save,
} from "lucide-react";

import {
  updateProjectAction,
  type UpdateProjectActionState,
} from "@/actions/project-actions";

const initialState: UpdateProjectActionState = {
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

type ProjectSettingsFormProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
    color: string;
    status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  };
};

export function ProjectSettingsForm({
  project,
}: ProjectSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProjectAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input
        type="hidden"
        name="projectId"
        value={project.id}
      />

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
          defaultValue={project.name}
          disabled={isPending}
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        />

        {state.fieldErrors?.name?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.name[0]}
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
          defaultValue={project.description ?? ""}
          disabled={isPending}
          placeholder="Describe this project..."
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        />

        {state.fieldErrors?.description?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.description[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="status"
          className="text-sm font-medium text-slate-200"
        >
          Project status
        </label>

        <select
          id="status"
          name="status"
          defaultValue={project.status}
          disabled={isPending}
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        >
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        {state.fieldErrors?.status?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.status[0]}
          </p>
        ) : null}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-200">
          Project color
        </legend>

        <div className="flex flex-wrap gap-3">
          {projectColors.map((color) => (
            <label
              key={color}
              className="cursor-pointer"
              title={color}
            >
              <input
                type="radio"
                name="color"
                value={color}
                defaultChecked={color === project.color}
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

      {state.message ? (
        <div
          role="status"
          className={
            state.success
              ? "flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
              : "rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          }
        >
          {state.success ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : null}

          {state.message}
        </div>
      ) : null}

      <div className="flex justify-end border-t border-slate-800 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Saving changes...
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