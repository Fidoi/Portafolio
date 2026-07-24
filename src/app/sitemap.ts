import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getProjects } from "@/actions";
import { slugify } from "@/lib/slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1 },
    { path: "/projects", priority: 0.8 },
    { path: "/integrations", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
  ].map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));

  // getProjects ya devuelve [] ante fallos de BD, así que el build no se rompe
  // si la base no está disponible en tiempo de compilación.
  const projects = await getProjects();
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/projects/${slugify(project.title)}`,
    lastModified: project.updatedAt ?? new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...projectRoutes];
}
