import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { comparisons } from "@/content/compare";

type Params = { slug: string };

export function generateStaticParams() {
  return Object.keys(comparisons).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const page = comparisons[params.slug as keyof typeof comparisons];
  if (!page) return {};
  return { title: page.title, description: page.summary };
}

export default function ComparePage({ params }: { params: Params }) {
  const page = comparisons[params.slug as keyof typeof comparisons];
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-semibold">{page.title}</h1>
      <p className="mt-4 text-white/65">{page.summary}</p>
      <table className="mt-10 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-white/50">
            <th className="py-3 font-medium">Capability</th>
            <th className="py-3 font-medium">Futurehuman</th>
            <th className="py-3 font-medium">{page.competitor}</th>
          </tr>
        </thead>
        <tbody>
          {page.rows.map((row) => (
            <tr key={row[0]} className="border-b border-white/5">
              {row.map((cell) => (
                <td key={cell} className="py-3 text-white/80">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
