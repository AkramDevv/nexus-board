"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Boxes,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Settings,
} from "lucide-react";

import { logoutAction } from "@/actions/auth-actions";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: ListTodo,
  },
  {
    label: "Activity",
    href: "/activity",
    icon: Activity,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

type DashboardSidebarProps = {
  user: {
    name?: string | null;
    email?: string | null;
    role: "ADMIN" | "MEMBER";
  };
};

export function DashboardSidebar({
  user,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const initials =
    user.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "NB";

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-800 bg-slate-950 lg:sticky lg:top-0 lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-slate-800 px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <Boxes className="size-5 text-white" />
          </span>

          <div>
            <p className="font-bold tracking-tight text-white">
              {APP_NAME}
            </p>
            <p className="text-xs text-slate-500">
              Team workspace
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Workspace
        </p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white",
              )}
            >
              <Icon
                className={cn(
                  "size-5 transition",
                  isActive
                    ? "text-white"
                    : "text-slate-500 group-hover:text-white",
                )}
              />

              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-900 p-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user.name ?? "NexusBoard User"}
            </p>

            <p className="truncate text-xs text-slate-500">
              {user.email}
            </p>
          </div>

          <span className="rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-400">
            {user.role}
          </span>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="size-5" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}