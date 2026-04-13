"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "@heroui/react";
import { Img } from "@/types";

export const ImageManager: React.FC<{ images: Img[] }> = ({ images }) => {
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return <p>No hay imágenes disponibles</p>;
  }

  const active = images[index];

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <motion.div
        key={active.src}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="rounded-2xl shadow-md bg-muted"
      >
        <Image
          src={active.src}
          alt={active.alt ?? `Imagen ${active.order}`}
          width={active.width ?? 800}
          height={active.height ?? 600}
          isZoomed
          isBlurred
          className="object-cover w-full h-auto"
        />
      </motion.div>

      <div className="flex items-center justify-center gap-3">
        {images.map((img, i) => {
          const isActive = i === index;

          return (
            <button
              key={img.src + i}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              aria-label={`Ver imagen ${img.order}`}
              className="rounded-full p-0 border-0 bg-transparent"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <motion.div
                layout
                initial={false}
                animate={isActive ? { scale: 1.08 } : { scale: 1 }}
                whileHover={{ scale: 1.12 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="h-20 w-20 md:h-16 md:w-16 rounded-full overflow-hidden flex items-center justify-center"
              >
                <Image
                  src={img.src}
                  alt={img.alt ?? `thumb-${img.order}`}
                  width={150}
                  height={150}
                  className="object-cover w-full h-full"
                  isZoomed
                  isBlurred
                />
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
