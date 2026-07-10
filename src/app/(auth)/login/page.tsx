import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "../../../../auth";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
    title: "Sign in",
    description: "Sign in to your NexusBoard workspace.",
};

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{
        registered?: string;
    }>;
}) {
    const session = await auth();

    if (session?.user) {
        redirect("/dashboard");
    }

    const params = await searchParams;
    const registered = params.registered === "true";

    return (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-8">
                <p className="mb-2 text-sm font-semibold text-blue-400">
                    Welcome back
                </p>

                <h1 className="text-3xl font-bold tracking-tight">
                    Sign in to your workspace
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                    Manage projects, tasks, team members, and productivity from one
                    workspace.
                </p>
            </div>

            {registered ? (
                <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    Your account was created successfully. You can now sign in.
                </div>
            ) : null}

            <LoginForm />

            <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-xs uppercase tracking-wider text-slate-500">
                    Demo account
                </span>
                <div className="h-px flex-1 bg-slate-800" />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm">
                <p className="font-medium text-slate-200">
                    admin@nexusboard.dev
                </p>
                <p className="mt-1 text-slate-500">Password: Demo123!</p>
            </div>

            <p className="mt-7 text-center text-sm text-slate-400">
                Do not have an account?{" "}
                <Link
                    href="/register"
                    className="font-semibold text-blue-400 hover:text-blue-300"
                >
                    Create account
                </Link>
            </p>
        </section>
    );
}