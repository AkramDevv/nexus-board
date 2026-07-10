import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "../../../../auth";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your NexusBoard workspace account.",
};

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-blue-400">
          Get started
        </p>

        <h1 className="text-3xl font-bold tracking-tight">
          Create your account
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Join NexusBoard and start managing projects, tasks, and teamwork
          from one professional workspace.
        </p>
      </div>

      <RegisterForm />

      <p className="mt-7 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-400 hover:text-blue-300"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}