"use client";

import { useActionState } from "react";
import {
  CheckCircle2,
  LoaderCircle,
  UserPlus,
} from "lucide-react";

import {
  addProjectMemberAction,
  type AddProjectMemberActionState,
} from "@/actions/member-actions";

const initialState: AddProjectMemberActionState = {
  success: false,
  message: "",
};

type AddProjectMemberFormProps = {
  projectId: string;
};

export function AddProjectMemberForm({
  projectId,
}: AddProjectMemberFormProps) {
  const [state, formAction, isPending] = useActionState(
    addProjectMemberAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input
        type="hidden"
        name="projectId"
        value={projectId}
      />

      <div className="grid gap-5 md:grid-cols-[1fr_180px]">
        <div className="space-y-2">
          <label
            htmlFor="memberEmail"
            className="text-sm font-medium text-slate-200"
          >
            User email
          </label>

          <input
            id="memberEmail"
            name="email"
            type="email"
            placeholder="member@example.com"
            disabled={isPending}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
          />

          {state.fieldErrors?.email?.[0] ? (
            <p className="text-sm text-red-400">
              {state.fieldErrors.email[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="memberRole"
            className="text-sm font-medium text-slate-200"
          >
            Project role
          </label>

          <select
            id="memberRole"
            name="role"
            defaultValue="MEMBER"
            disabled={isPending}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 disabled:opacity-60"
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

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

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Adding member...
          </>
        ) : (
          <>
            <UserPlus className="size-4" />
            Add member
          </>
        )}
      </button>
    </form>
  );
}