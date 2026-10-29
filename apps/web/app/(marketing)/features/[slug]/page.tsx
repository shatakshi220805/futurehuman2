import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { features } from "@/content/features";
import { DownloadForm } from "@/components/marketing/download-form";

type Params = { slug: string };

export function generateStaticParams() {
  return Object.keys(features).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const feature = features[params.slug as keyof typeof features];
  if (!feature) return {};
  return { title: feature.title, description: feature.description };
}

export default function FeaturePage({ params }: { params: Params }) {
  const feature = features[params.slug as keyof typeof features];
  if (!feature) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs uppercase tracking-wide text-emerald-300">{feature.eyebrow}</p>
      <h1 className="mt-3 text-4xl font-semibold">{feature.title}</h1>
      <p className="mt-4 text-lg text-white/65">{feature.description}</p>
      <ul className="mt-8 space-y-3">
        {feature.points.map((p) => (
          <li key={p} className="glass px-4 py-3 text-sm">
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <DownloadForm source={`feature-${feature.slug}`} />
      </div>
    </article>
  );
}
