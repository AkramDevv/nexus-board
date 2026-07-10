import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Tasks",
};

export default function TasksPage() {
  return (
    <div>
      <p className="text-sm font-semibold text-blue-400">
        Productivity
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        My Tasks
      </h1>

      <p className="mt-3 text-slate-500">
        Task management features are being prepared.
      </p>
    </div>
  );
}