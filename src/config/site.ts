/**
 * Fuente única de verdad para la identidad del sitio.
 * La consumen: metadata (layout), JSON-LD, sitemap, robots, imagen OG,
 * footer y sección de contacto. Cambiar aquí propaga a todo.
 */

// La URL canónica se toma de la variable de entorno para que funcione en
// local, preview y producción sin hardcodear. Ajusta NEXT_PUBLIC_SITE_URL
// en producción a tu dominio real.
// En Vercel, VERCEL_URL siempre está definida, así que preview y producción
// resuelven solas. En local cae a localhost: preferible a inventar un dominio
// que luego se filtra al sitemap y a las etiquetas OpenGraph.
const fallbackUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const siteConfig = {
  name: "Fidel Alarcón",
  role: "Desarrollador Fullstack",
  title: "Fidel Alarcón — Desarrollador Fullstack",
  description:
    "Desarrollador fullstack especializado en Next.js, React y TypeScript. Revisa mis proyectos, mi stack y conversa con la IA integrada en el portafolio.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? fallbackUrl,
  locale: "es_CL",
  keywords: [
    "Fidel Alarcón",
    "desarrollador fullstack",
    "Next.js",
    "React",
    "TypeScript",
    "Prisma",
    "portafolio",
    "desarrollador web Chile",
  ],
  contact: {
    email: "fidel.alarcon.leiva@hotmail.com",
  },
  links: {
    github: "https://github.com/Fidoi",
  },
} as const;

export type SiteConfig = typeof siteConfig;
