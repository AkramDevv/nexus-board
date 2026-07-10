import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <div>
      <p className="text-sm font-semibold text-blue-400">
        Workspace
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        Projects
      </h1>

      <p className="mt-3 text-slate-500">
        Project management features are being prepared.
      </p>
    </div>
  );
}