import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPost, listPosts } from "@/lib/blog";

export function generateStaticParams() {
  return listPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  return (
    <article className="prose prose-invert mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs text-white/40">{post.date}</p>
      <h1 className="text-4xl font-semibold">{post.title}</h1>
      <div className="mt-8 space-y-4 text-white/75">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
