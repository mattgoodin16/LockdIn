"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAV, APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(82,226,255,0.14),transparent_50%),linear-gradient(180deg,#0A1018_0%,#0E1521_100%)] text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0A1018]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/home" className="text-lg font-semibold tracking-wide">
            {APP_NAME}
          </Link>
          <Button variant="outline" className="border-white/20 bg-transparent md:hidden" onClick={() => setOpen((v) => !v)}>
            <Menu className="h-4 w-4" />
          </Button>
          <nav className="hidden gap-2 md:flex">
            {APP_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition",
                  pathname === item.href
                    ? "bg-cyan-300/20 text-cyan-200"
                    : "text-zinc-300 hover:bg-white/10",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {open ? (
          <nav className="mx-auto grid max-w-6xl gap-1 px-4 pb-3 md:hidden">
            {APP_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  pathname === item.href
                    ? "bg-cyan-300/20 text-cyan-200"
                    : "text-zinc-300 hover:bg-white/10",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
