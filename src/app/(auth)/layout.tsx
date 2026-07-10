import Link from "next/link";
import { Boxes } from "lucide-react";

import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-12 text-white">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-3"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <Boxes className="size-6" />
          </span>

          <span className="text-xl font-bold">{APP_NAME}</span>
        </Link>

        {children}
      </div>
    </main>
  );
}