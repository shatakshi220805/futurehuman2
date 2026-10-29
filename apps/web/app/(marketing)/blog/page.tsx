import type { Metadata } from "next";
import Link from "next/link";
import { listPosts } from "@/lib/blog";

export const metadata: Metadata = { title: "Blog" };

export default function BlogIndex() {
  const posts = listPosts();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-semibold">Blog</h1>
      <ul className="mt-10 space-y-6">
        {posts.map((post) => (
          <li key={post.slug} className="glass p-5">
            <p className="text-xs text-white/40">{post.date}</p>
            <Link href={`/blog/${post.slug}`} className="mt-1 block text-xl font-medium">
              {post.title}
            </Link>
            <p className="mt-2 text-sm text-white/60">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
