import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div>
      <p className="text-sm font-semibold text-blue-400">
        Preferences
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        Settings
      </h1>

      <p className="mt-3 text-slate-500">
        Account and workspace settings will appear here.
      </p>
    </div>
  );
}