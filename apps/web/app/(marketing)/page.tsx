import Link from "next/link";
import { Shield, Pause, Trash2, Lock } from "lucide-react";
import { HeroMockup } from "@/components/marketing/hero-mockup";
import { LogoMarquee } from "@/components/marketing/logo-marquee";
import { DownloadForm } from "@/components/marketing/download-form";
import { Faq } from "@/components/marketing/faq";
import { PricingTable } from "@/components/marketing/pricing-table";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-8 pt-16 lg:grid-cols-2 lg:pt-24">
        <div>
          <p className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
            Personal AI work memory
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
            The AI that understands your work
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/60">
            Futurehuman connects to your apps, calls, and screen, learns your work, then takes it from there:
            notes, replies, invites, tasks, and briefs.
          </p>
          <div className="mt-8">
            <DownloadForm source="hero" />
            <p className="mt-3 text-xs text-white/40">
              Free to start on Mac and Windows. Or{" "}
              <Link className="underline" href="/sign-up">
                start in the browser
              </Link>
              .
            </p>
          </div>
        </div>
        <HeroMockup />
      </section>
      <LogoMarquee />

      <FeatureBlock
        kicker="Meetings"
        title="Notes without a bot in the room"
        body="Desktop capture of system audio and mic. After the call: executive summary, owners on every action, Gmail draft you send yourself."
        href="/features/meetings"
      />
      <FeatureBlock
        kicker="Chat"
        title="Ask anything. It already has the backstory."
        body="Retrieval over your meetings, screen, and connected apps. Answers include source pills you can open."
        href="/features/chat"
        reverse
      />
      <FeatureBlock
        kicker="Routines"
        title="A Morning Brief at 7:00 AM"
        body="Overnight email, Slack, calendar, and client priorities — three actions before your first meeting."
        href="/features/routines"
      />

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-semibold">Your memory stays yours</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, title: "SOC 2 program", body: "Encryption in transit and at rest." },
            { icon: Lock, title: "Never sold", body: "Your work is not a training commodity." },
            { icon: Pause, title: "Pause anytime", body: "Block apps and password managers." },
            { icon: Trash2, title: "Hard delete", body: "Item, range, or everything." },
          ].map((item) => (
            <div key={item.title} className="glass p-5">
              <item.icon className="h-5 w-5 text-emerald-300" />
              <h3 className="mt-3 font-medium">{item.title}</h3>
              <p className="mt-1 text-sm text-white/55">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-8 text-center text-3xl font-semibold">Start free, upgrade anytime</h2>
        <PricingTable />
      </section>
      <Faq />
    </>
  );
}

function FeatureBlock({
  kicker,
  title,
  body,
  href,
  reverse,
}: {
  kicker: string;
  title: string;
  body: string;
  href: string;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 lg:grid-cols-2">
      <div className={reverse ? "lg:order-2" : ""}>
        <p className="text-xs uppercase tracking-wide text-emerald-300">{kicker}</p>
        <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
        <p className="mt-3 text-white/60">{body}</p>
        <Link href={href} className="mt-4 inline-block text-sm text-white underline">
          Learn more
        </Link>
      </div>
      <div className="glass h-56 bg-white/[0.03]" />
    </section>
  );
}
