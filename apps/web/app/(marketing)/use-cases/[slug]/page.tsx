import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useCases } from "@/content/use-cases";
import { DownloadForm } from "@/components/marketing/download-form";

type Params = { slug: string };

export function generateStaticParams() {
  return Object.keys(useCases).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const page = useCases[params.slug as keyof typeof useCases];
  if (!page) return {};
  return { title: `${page.title} use case`, description: page.description };
}

export default function UseCasePage({ params }: { params: Params }) {
  const page = useCases[params.slug as keyof typeof useCases];
  if (!page) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs uppercase tracking-wide text-emerald-300">Use case</p>
      <h1 className="mt-3 text-4xl font-semibold">{page.title}</h1>
      <p className="mt-4 text-lg text-white/65">{page.description}</p>
      <div className="mt-10">
        <DownloadForm source={`use-case-${page.slug}`} />
      </div>
    </article>
  );
}
