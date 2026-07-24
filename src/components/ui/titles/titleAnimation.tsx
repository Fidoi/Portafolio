"use client";
import { ElementType, useEffect, useRef } from "react";
import gsap from "gsap";

type TitleTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

interface Props {
  title: string;
  className?: string;
  /**
   * Elemento a renderizar. Por defecto "span" para NO inyectar encabezados
   * donde no corresponde (navbar, títulos de tarjetas). Usa "h1"/"h2"… solo
   * en los títulos reales de cada página para mantener una jerarquía correcta.
   */
  as?: TitleTag;
}

export const TitleAnimation = ({ title, className, as = "span" }: Props) => {
  const titleRef = useRef<HTMLElement | null>(null);
  const Tag = as as ElementType;

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    );
  }, []);

  return (
    <Tag ref={titleRef} className={`font-bold ${className ?? ""}`}>
      {title}
    </Tag>
  );
};
