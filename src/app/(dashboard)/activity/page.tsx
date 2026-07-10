import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activity",
};

export default function ActivityPage() {
  return (
    <div>
      <p className="text-sm font-semibold text-blue-400">
        History
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        Activity
      </h1>

      <p className="mt-3 text-slate-500">
        Workspace activity will appear here.
      </p>
    </div>
  );
}