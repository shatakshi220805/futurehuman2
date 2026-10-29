import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { features } from "@/content/features";
import { comparisons } from "@/content/compare";
import { useCases } from "@/content/use-cases";
import { listPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/pricing", "/blog", "/changelog", "/security", "/legal/privacy", "/legal/terms"];
  const dynamic = [
    ...Object.keys(features).map((s) => `/features/${s}`),
    ...Object.keys(comparisons).map((s) => `/compare/${s}`),
    ...Object.keys(useCases).map((s) => `/use-cases/${s}`),
    ...listPosts().map((p) => `/blog/${p.slug}`),
  ];
  return [...staticPaths, ...dynamic].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));
}
