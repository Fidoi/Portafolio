import Link from "next/link";
import { FiGithub, FiMail, FiArrowUpRight } from "react-icons/fi";
import { siteConfig } from "@/config/site";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/projects", label: "Proyectos" },
  { href: "/integrations", label: "Integraciones" },
  { href: "/contact", label: "Contacto" },
];

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-24 border-t border-divider bg-background/60 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-sm flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white">
                F
              </span>
              <span className="text-lg font-semibold">{siteConfig.name}</span>
            </div>
            <p className="text-sm text-default-500">
              {siteConfig.role} · Next.js, React y TypeScript. En búsqueda de
              nuevas oportunidades.
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-default-400">
              Navegación
            </span>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-default-600 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-default-400">
              Contacto
            </span>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-default-600 transition-colors hover:text-primary"
            >
              <FiGithub aria-hidden />
              GitHub
              <FiArrowUpRight className="text-xs" aria-hidden />
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center gap-2 text-sm text-default-600 transition-colors hover:text-primary"
            >
              <FiMail aria-hidden />
              {siteConfig.contact.email}
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-divider pt-6 text-center text-xs text-default-400">
          © {year} {siteConfig.name}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};
