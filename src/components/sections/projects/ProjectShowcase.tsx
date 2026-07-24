"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Image, Link, Modal, ModalContent } from "@heroui/react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCpu,
  FiExternalLink,
  FiGithub,
  FiLock,
  FiX,
  FiZoomIn,
} from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { TitleAnimation } from "@/components/ui/titles/titleAnimation";

interface Props {
  title: string;
  description: string;
  commentary?: string;
  /** [liveUrl, repoUrl] */
  links: string[];
  /** [poster, logo] — el campo `technologies` guarda URLs de imagen */
  referenceImages: string[];
  /** Capturas del proyecto para la galería. */
  screenshots: string[];
}

const isHttpUrl = (url?: string): url is string =>
  !!url && /^https?:\/\//i.test(url);
const isGithub = (url: string) => /github\.com/i.test(url);

/** Limpia el commentary (viene con guiones/viñetas iniciales tipo "- ..."). */
const cleanNote = (value?: string) =>
  value?.replace(/^[\s\-–—•·]+/, "").trim() || "";

/** Host legible para la barra de direcciones del mockup de navegador. */
const hostOf = (url?: string) => {
  if (!isHttpUrl(url)) return null;
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return null;
  }
};

/**
 * Presentación tipo "case study" de un proyecto: panel de información
 * (sticky en desktop) + galería de capturas dentro de un mockup de navegador.
 * En móvil la información va primero para que se entienda el proyecto sin
 * scrollear; en desktop conviven lado a lado.
 */
export const ProjectShowcase = ({
  title,
  description,
  commentary,
  links,
  referenceImages,
  screenshots,
}: Props) => {
  const [liveUrl, repoUrl] = links ?? [];
  const [poster, logo] = referenceImages ?? [];
  const note = cleanNote(commentary);
  const host = hostOf(liveUrl);
  const hasGallery = screenshots.length > 0;
  const multiple = screenshots.length > 1;

  // Índice de la captura ampliada; null = lightbox cerrado.
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const swiperRef = useRef<SwiperClass | null>(null);
  const isZoomOpen = zoomIndex !== null;

  const showPrev = useCallback(() => {
    setZoomIndex((i) =>
      i === null ? i : (i - 1 + screenshots.length) % screenshots.length,
    );
  }, [screenshots.length]);

  const showNext = useCallback(() => {
    setZoomIndex((i) => (i === null ? i : (i + 1) % screenshots.length));
  }, [screenshots.length]);

  // Con el lightbox abierto el carrusel de fondo debe quedarse quieto: si sigue
  // avanzando, al cerrar apareces en una captura distinta de la que mirabas.
  useEffect(() => {
    const autoplay = swiperRef.current?.autoplay;
    if (!autoplay) return;
    if (isZoomOpen) autoplay.stop();
    else if (multiple) autoplay.start();
  }, [isZoomOpen, multiple]);

  // Flechas del teclado para moverse entre capturas ampliadas. El Modal de
  // HeroUI ya se encarga de Escape, del foco y del scroll del body.
  useEffect(() => {
    if (!isZoomOpen || !multiple) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isZoomOpen, multiple, showPrev, showNext]);

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
      {/* ── Panel de información ─────────────────────────────── */}
      <div className="lg:sticky lg:top-6">
        <div className="overflow-hidden rounded-2xl border border-divider bg-content1 shadow-md">
          {/* Cabecera: la imagen de referencia llena todo el espacio (cover);
              se recorta lo que sobre para no dejar zonas vacías. */}
          <div className="relative h-44 overflow-hidden sm:h-52">
            {isHttpUrl(poster) ? (
              <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${poster}")` }}
              />
            ) : (
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-600 to-primary-800"
              />
            )}
          </div>

          <div className="px-5 pb-6 sm:px-6">
            {isHttpUrl(logo) ? (
              <div className="-mt-9 flex">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white p-2 shadow-md ring-4 ring-content1">
                  <Image
                    removeWrapper
                    alt={`Logo de ${title}`}
                    className="h-full w-full object-contain"
                    src={logo}
                  />
                </div>
              </div>
            ) : null}

            <div className={isHttpUrl(logo) ? "mt-3" : "mt-2"}>
              <TitleAnimation
                as="h1"
                title={title}
                className="text-2xl sm:text-3xl"
              />
            </div>

            <p className="mt-3 leading-relaxed text-default-600">
              {description}
            </p>

            {note ? (
              <div className="mt-4 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
                <div className="mb-1 flex items-center gap-2">
                  <FiCpu className="text-primary" aria-hidden />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                    Tecnologías
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-default-500">
                  {note}
                </p>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3">
              {isHttpUrl(liveUrl) ? (
                <Button
                  as={Link}
                  href={liveUrl}
                  isExternal
                  color="primary"
                  radius="full"
                  className="font-medium"
                  endContent={<FiExternalLink />}
                >
                  Ver en vivo
                </Button>
              ) : null}

              {isHttpUrl(repoUrl) ? (
                <Button
                  as={Link}
                  href={repoUrl}
                  isExternal
                  variant="bordered"
                  radius="full"
                  className="border-default-300 font-medium text-default-700"
                  endContent={
                    isGithub(repoUrl) ? <FiGithub /> : <FiExternalLink />
                  }
                >
                  Ver código
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* ── Galería (mockup de navegador) ───────────────────── */}
      {hasGallery ? (
        <div className="overflow-hidden rounded-2xl border border-divider bg-content1 shadow-lg">
          {/* Barra del navegador: da contexto y credibilidad (URL real). */}
          <div className="flex items-center gap-2 border-b border-divider bg-content2/60 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-danger/70" />
            <span className="h-3 w-3 rounded-full bg-warning/70" />
            <span className="h-3 w-3 rounded-full bg-success/70" />
            {host ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir ${host} en una pestaña nueva`}
                className="ml-3 flex min-w-0 items-center gap-1.5 rounded-md bg-content1 px-3 py-1 text-xs text-default-500 transition hover:text-primary"
              >
                <FiLock className="shrink-0" aria-hidden />
                <span className="truncate">{host}</span>
              </a>
            ) : (
              <span className="ml-3 h-6 flex-1 rounded-md bg-content1" />
            )}
          </div>

          <Swiper
            className="w-full"
            style={
              {
                "--swiper-pagination-color": "#8B5CF6",
                "--swiper-navigation-color": "#8B5CF6",
                "--swiper-navigation-size": "26px",
                "--swiper-pagination-bullet-inactive-color": "#a1a1aa",
              } as React.CSSProperties
            }
            spaceBetween={0}
            loop={multiple}
            pagination={multiple ? { clickable: true } : false}
            navigation={multiple}
            autoplay={
              multiple
                ? {
                    delay: 4500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            modules={[Autoplay, Pagination, Navigation]}
            onSwiper={(instance) => {
              swiperRef.current = instance;
            }}
          >
            {screenshots.map((src, index) => (
              <SwiperSlide key={`${src}-${index}`}>
                <button
                  type="button"
                  onClick={() => setZoomIndex(index)}
                  aria-label={`Ampliar captura ${index + 1} de ${title}`}
                  className="group relative block aspect-video w-full cursor-zoom-in bg-content2"
                >
                  <Image
                    removeWrapper
                    alt={`${title} — captura ${index + 1}`}
                    className="absolute inset-0 h-full w-full object-contain"
                    src={src}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/70 text-default-600 opacity-0 shadow-md backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <FiZoomIn />
                  </span>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : null}

      {/* ── Lightbox ────────────────────────────────────────── */}
      {/* `size="full"` hace que el modal ocupe todo el viewport en cualquier
          dispositivo; la imagen crece hasta llenarlo dejando solo un margen
          para los controles, y siempre entra completa (object-contain). */}
      <Modal
        isOpen={isZoomOpen}
        onOpenChange={(open) => {
          if (!open) setZoomIndex(null);
        }}
        size="full"
        backdrop="blur"
        hideCloseButton
        classNames={{
          base: "bg-transparent shadow-none",
          body: "p-0",
          wrapper: "items-center justify-center",
        }}
      >
        <ModalContent>
          <div className="relative flex h-dvh w-screen items-center justify-center overflow-hidden p-3 sm:p-6">
            {isZoomOpen ? (
              <Image
                removeWrapper
                alt={`${title} — captura ${zoomIndex + 1} ampliada`}
                className="max-h-[88dvh] max-w-[94vw] rounded-xl object-contain"
                src={screenshots[zoomIndex]}
              />
            ) : null}

            <Button
              isIconOnly
              radius="full"
              variant="flat"
              aria-label="Cerrar"
              onPress={() => setZoomIndex(null)}
              className="absolute right-3 top-3 z-20 bg-background/70 backdrop-blur sm:right-5 sm:top-5"
            >
              <FiX className="text-lg" />
            </Button>

            {multiple ? (
              <>
                <Button
                  isIconOnly
                  radius="full"
                  variant="flat"
                  aria-label="Captura anterior"
                  onPress={showPrev}
                  className="absolute left-2 top-1/2 z-20 -translate-y-1/2 bg-background/70 backdrop-blur sm:left-5"
                >
                  <FiChevronLeft className="text-lg sm:text-xl" />
                </Button>
                <Button
                  isIconOnly
                  radius="full"
                  variant="flat"
                  aria-label="Captura siguiente"
                  onPress={showNext}
                  className="absolute right-2 top-1/2 z-20 -translate-y-1/2 bg-background/70 backdrop-blur sm:right-5"
                >
                  <FiChevronRight className="text-lg sm:text-xl" />
                </Button>
                <span className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-background/70 px-3 py-1 text-tiny text-default-600 backdrop-blur sm:bottom-6">
                  {(zoomIndex ?? 0) + 1} / {screenshots.length}
                </span>
              </>
            ) : null}
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};
