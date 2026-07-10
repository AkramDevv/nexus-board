import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";

import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
          <LayoutDashboard className="size-8" />
        </div>

        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
          Project Management Platform
        </p>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            {APP_NAME}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          {APP_DESCRIPTION}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold transition hover:bg-blue-500"
          >
            Open dashboard
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-700 px-6 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}