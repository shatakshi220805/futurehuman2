"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/brand/logo";

const links = [
  { href: "/app", label: "Chat" },
  { href: "/app/memory", label: "Memory" },
  { href: "/app/meetings", label: "Meetings" },
  { href: "/app/routines", label: "Routines" },
  { href: "/app/settings", label: "Settings" },
];

export function AppShell({
  children,
  onboardingComplete,
}: {
  children: React.ReactNode;
  onboardingComplete: boolean;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-ink text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-56 border-r border-white/10 p-4 md:block">
        <Logo />
        <nav className="mt-8 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block rounded-xl px-3 py-2 text-sm ${
                pathname === l.href ? "bg-white/10" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        {!onboardingComplete ? (
          <Link href="/app/onboarding" className="mt-6 block rounded-xl bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
            Finish onboarding
          </Link>
        ) : null}
      </aside>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-ink/70 px-4 py-3 backdrop-blur md:ml-56">
        <div className="flex gap-3 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-xs text-white/70">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto">
          <UserButton />
        </div>
      </header>
      <div className="md:ml-56">{children}</div>
    </div>
  );
}
