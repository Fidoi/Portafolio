"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "@heroui/react";

type Img = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

const DEFAULT_IMAGES: Img[] = [
  {
    src: "https://firebasestorage.googleapis.com/v0/b/desarrollo-5753a.appspot.com/o/mitaka_asa_ka.gif?alt=media&token=aeff2b74-79ef-4c15-bf3c-1f2930d110c2",
    alt: "Mitaka_Asa",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/desarrollo-5753a.appspot.com/o/Editarperfils2025-10-1-23.15.620story-ezgif.com-video-to-gif-converter.gif?alt=media&token=9296c19e-650c-4a99-a6da-e9a93162b02f",
    alt: "Mitaka_Asa_2",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/desarrollo-5753a.appspot.com/o/Editarperfils2025-10-1-23.33.920story-ezgif.com-video-to-gif-converter.gif?alt=media&token=5bf6e0f6-6bb1-4ce1-af80-2de197996062",
    alt: "Pomni",
  },
];

export const ImageManager: React.FC<{ images?: Img[] }> = ({
  images = DEFAULT_IMAGES,
}) => {
  const [index, setIndex] = useState(0);
  const active = images[index];

  return (
    <div className="w-full flex flex-col items-center gap-4 ">
      <motion.div
        key={active.src}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="rounded-2xl overflow-hidden shadow-md bg-muted"
        aria-live="polite"
      >
        <Image
          src={active.src}
          alt={active.alt ?? `Imagen ${index + 1}`}
          width={active.width ?? 800}
          height={active.height ?? 600}
          isZoomed
          isBlurred={false}
          className="object-cover w-full h-auto"
        />
      </motion.div>
      <div className="flex items-center justify-center gap-3 ">
        {images.map((img, i) => {
          const isActive = i === index;
          return (
            <button
              key={img.src + i}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              aria-label={`Ver imagen ${i + 1}`}
              className="rounded-full p-0 border-0 bg-transparent"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <motion.div
                layout
                initial={false}
                animate={isActive ? { scale: 1.08 } : { scale: 1 }}
                whileHover={{ scale: 1.12 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className={`
                    h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16
                    rounded-full
                    overflow-hidden
                    flex items-center justify-center
                  `}
              >
                <Image
                  src={img.src}
                  alt={img.alt ?? `thumb-${i + 1}`}
                  width={150}
                  height={150}
                  className="object-cover w-full h-full"
                  isZoomed={false}
                  isBlurred={false}
                />
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
