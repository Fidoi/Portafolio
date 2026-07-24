"use client";

import { Image } from "@heroui/react";
import Link from "next/link";

interface Props {
  title: string;
  urlImage: string;
  url: string;
  description?: string;
  /** URL del sitio en vivo, si el proyecto está desplegado. */
  liveUrl?: string;
}

/**
 * Tarjeta de la grilla de proyectos. La portada usa un ratio fijo para que
 * las filas queden parejas sin importar el tamaño original de cada imagen, y
 * el texto va debajo (no encima) para que se lea igual sobre portadas claras
 * u oscuras, sin depender de sombras que simulen contorno.
 */
export const Cards = ({
  title,
  urlImage,
  url,
  description,
  liveUrl,
}: Props) => {
  const isLive = !!liveUrl && /^https?:\/\//i.test(liveUrl);

  return (
    <Link
      href={url}
      aria-label={`Ver proyecto ${title}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-divider bg-content1 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-default-100">
        <Image
          removeWrapper
          alt={`Portada del proyecto ${title}`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={urlImage}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold leading-tight tracking-tight text-foreground">
            {title}
          </h2>

          {isLive && (
            <span className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-tiny font-medium text-primary ring-1 ring-inset ring-primary/25">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-primary"
              />
              En vivo
            </span>
          )}
        </div>

        {description && (
          <p className="line-clamp-2 text-small leading-relaxed text-default-500">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
};
