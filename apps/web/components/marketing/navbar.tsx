"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/brand/logo";
import { productLinks, compareLinks, resourceLinks } from "@/content/nav";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0F17]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" aria-label="Futurehuman home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <HoverMenu label="Product" items={productLinks} />
          <HoverMenu
            label="Compare"
            items={compareLinks.map((l) => ({ ...l, description: "See how we differ" }))}
          />
          <HoverMenu
            label="Resources"
            items={resourceLinks.map((l) => ({ ...l, description: "" }))}
          />
          <Link className="rounded-full px-3 py-2 text-sm text-white/80 hover:text-white" href="/pricing">
            Pricing
          </Link>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <SignedOut>
            <Link className="text-sm text-white/80 hover:text-white" href="/sign-in">
              Sign in
            </Link>
            <Link
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-white/90"
              href="/sign-up"
            >
              Start free
            </Link>
          </SignedOut>
          <SignedIn>
            <Link className="text-sm text-white/80" href="/app">
              Open app
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
        <button
          className="rounded-md p-2 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-white/10 px-4 py-4 md:hidden">
          {[...productLinks, ...compareLinks, { href: "/pricing", title: "Pricing" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-2 py-3 text-sm"
              onClick={() => setOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}

function HoverMenu({
  label,
  items,
}: {
  label: string;
  items: Array<{ href: string; title: string; description?: string }>;
}) {
  return (
    <div className="group relative">
      <button className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-white/80 hover:text-white">
        {label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      <div className="invisible absolute left-0 top-full w-72 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="glass p-2 shadow-glow">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2 hover:bg-white/[0.05]">
              <div className="text-sm text-white">{item.title}</div>
              {item.description ? (
                <div className="text-xs text-white/50">{item.description}</div>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
