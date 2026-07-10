import Link from "next/link";
import {
  Bell,
  Boxes,
  Menu,
  Search,
} from "lucide-react";

type DashboardHeaderProps = {
  userName?: string | null;
};

export function DashboardHeader({
  userName,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          aria-label="Open navigation"
          className="flex size-10 items-center justify-center rounded-xl border border-slate-800 text-slate-400 transition hover:bg-slate-900 hover:text-white"
        >
          <Menu className="size-5" />
        </button>

        <Link
          href="/dashboard"
          className="flex size-10 items-center justify-center rounded-xl bg-blue-600"
        >
          <Boxes className="size-5 text-white" />
        </Link>
      </div>

      <div className="hidden lg:block">
        <p className="text-sm text-slate-500">
          Welcome back,
        </p>

        <p className="font-semibold text-white">
          {userName ?? "NexusBoard User"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

          <input
            type="search"
            placeholder="Search workspace..."
            className="h-10 w-64 rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-10 items-center justify-center rounded-xl border border-slate-800 text-slate-400 transition hover:bg-slate-900 hover:text-white"
        >
          <Bell className="size-5" />

          <span className="absolute right-2 top-2 size-2 rounded-full bg-blue-500" />
        </button>

        <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white lg:hidden">
          {userName?.charAt(0).toUpperCase() ?? "N"}
        </div>
      </div>
    </header>
  );
}