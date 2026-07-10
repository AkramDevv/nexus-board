"use client";

import { useActionState } from "react";
import { LoaderCircle, UserPlus } from "lucide-react";

import {
  registerAction,
  type RegisterActionState,
} from "@/actions/auth-actions";

const initialState: RegisterActionState = {
  success: false,
  message: "",
};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium text-slate-200"
        >
          Full name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Alex Morgan"
          disabled={isPending}
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        />

        {state.fieldErrors?.name?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.name[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-slate-200"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          disabled={isPending}
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        />

        {state.fieldErrors?.email?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.email[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-200"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          disabled={isPending}
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        />

        {state.fieldErrors?.password?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.password[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-slate-200"
        >
          Confirm password
        </label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          disabled={isPending}
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        />

        {state.fieldErrors?.confirmPassword?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.confirmPassword[0]}
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

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            <UserPlus className="size-4" />
            Create account
          </>
        )}
      </button>
    </form>
  );
}