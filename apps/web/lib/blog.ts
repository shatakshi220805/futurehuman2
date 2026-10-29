import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const dir = path.join(process.cwd(), "content/blog");

export function listPosts() {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: String(data.title),
        excerpt: String(data.excerpt ?? ""),
        date: String(data.date),
        author: String(data.author ?? "Futurehuman"),
        content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string) {
  return listPosts().find((p) => p.slug === slug) ?? null;
}
