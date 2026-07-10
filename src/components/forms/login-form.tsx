"use client";

import { useActionState } from "react";
import { LoaderCircle, LogIn } from "lucide-react";

import {
  loginAction,
  type LoginActionState,
} from "@/actions/auth-actions";

const initialState: LoginActionState = {
  success: false,
  message: "",
};

/*
function SubmitButton() {
  return (
    <button
      type="submit"
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogIn className="size-4" />
      Sign in
    </button>
  );
}
*/

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
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
          defaultValue="admin@nexusboard.dev"
          placeholder="name@example.com"
          disabled={isPending}
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-200"
          >
            Password
          </label>

          <span className="text-xs text-slate-500">Demo123!</span>
        </div>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          defaultValue="Demo123!"
          placeholder="Enter your password"
          disabled={isPending}
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        />
      </div>

      {state.message && !state.success ? (
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
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="size-4" />
            Sign in
          </>
        )}
      </button>
    </form>
  );
}