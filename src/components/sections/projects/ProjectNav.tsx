"use client";

import { Image } from "@heroui/react";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight, FiChevronLeft } from "react-icons/fi";

interface NavItem {
  title: string;
  href: string;
  image?: string;
}

interface Props {
  previous: NavItem | null;
  next: NavItem | null;
}

const buttonBase =
  "group inline-flex min-w-0 items-center gap-2 rounded-xl border border-divider bg-content1 py-1.5 text-sm font-medium text-default-600 transition hover:border-primary/40 hover:bg-content2/40 hover:text-primary";

// La miniatura solo aparece desde `sm` para no saturar la barra en móvil,
// donde el botón cae con la flecha + el nombre (que es lo importante).
const thumb =
  "hidden h-8 w-12 shrink-0 overflow-hidden rounded-lg bg-content2 sm:block";

const name = "max-w-[80px] truncate sm:max-w-[150px]";

/**
 * Barra superior de la ficha de proyecto: breadcrumb al listado + saltos al
 * proyecto anterior/siguiente mostrando su miniatura y nombre (sin contador
 * de posición, que no aporta valor al visitante).
 */
export const ProjectNav = ({ previous, next }: Props) => {
  return (
    <nav
      aria-label="Navegación entre proyectos"
      className="flex items-center justify-between gap-3"
    >
      <Link
        href="/projects"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-default-500 transition hover:bg-default-100 hover:text-foreground"
      >
        <FiChevronLeft className="h-4 w-4" />
        Proyectos
      </Link>

      <div className="flex min-w-0 items-center gap-2">
        {previous ? (
          <Link
            href={previous.href}
            aria-label={`Proyecto anterior: ${previous.title}`}
            className={`${buttonBase} pl-2 pr-3`}
          >
            <FiArrowLeft
              aria-hidden
              className="h-4 w-4 shrink-0 text-default-400 transition group-hover:-translate-x-0.5 group-hover:text-primary"
            />
            {previous.image ? (
              <span className={thumb}>
                <Image
                  removeWrapper
                  alt=""
                  className="h-full w-full object-cover"
                  src={previous.image}
                />
              </span>
            ) : null}
            <span className={name}>{previous.title}</span>
          </Link>
        ) : null}

        {next ? (
          <Link
            href={next.href}
            aria-label={`Proyecto siguiente: ${next.title}`}
            className={`${buttonBase} pl-3 pr-2`}
          >
            <span className={name}>{next.title}</span>
            {next.image ? (
              <span className={thumb}>
                <Image
                  removeWrapper
                  alt=""
                  className="h-full w-full object-cover"
                  src={next.image}
                />
              </span>
            ) : null}
            <FiArrowRight
              aria-hidden
              className="h-4 w-4 shrink-0 text-default-400 transition group-hover:translate-x-0.5 group-hover:text-primary"
            />
          </Link>
        ) : null}
      </div>
    </nav>
  );
};
