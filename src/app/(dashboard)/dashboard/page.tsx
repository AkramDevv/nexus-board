import { redirect } from "next/navigation";

import { auth } from "../../../../auth";
import { logoutAction } from "@/actions/auth-actions";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <p className="text-sm font-semibold text-blue-400">
            Authentication successful
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Welcome, {session.user.name}
          </h1>

          <div className="mt-6 rounded-xl bg-slate-950 p-5 text-sm text-slate-300">
            <p>Email: {session.user.email}</p>
            <p className="mt-2">User ID: {session.user.id}</p>
            <p className="mt-2">Role: {session.user.role}</p>
          </div>

          <form action={logoutAction} className="mt-8">
            <button
              type="submit"
              className="rounded-xl bg-red-500 px-5 py-3 font-semibold transition hover:bg-red-400"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}