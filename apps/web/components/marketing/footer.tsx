import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { compareLinks, productLinks } from "@/content/nav";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-white/50">
            Personal AI work memory. Meetings, screen, and apps — then notes, briefs, and drafts.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-white">Product</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            {productLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/pricing" className="hover:text-white">
                Pricing
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-medium text-white">Compare</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            {compareLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/use-cases/sales" className="hover:text-white">
                Use cases
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-medium text-white">Legal</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li>
              <Link href="/legal/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/legal/terms">Terms</Link>
            </li>
            <li>
              <Link href="/legal/dpa">DPA</Link>
            </li>
            <li>
              <Link href="/legal/subprocessors">Subprocessors</Link>
            </li>
            <li>
              <Link href="/security">Trust Center</Link>
            </li>
            <li>
              <Link href="/changelog">Changelog</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Futurehuman. Your memory stays yours.
      </div>
    </footer>
  );
}
