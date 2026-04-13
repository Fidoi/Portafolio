"use server";

import prisma from "@/lib/prisma";
import { Img } from "@/types";

export const getGalleryImages = async (): Promise<Img[]> => {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: {
        order: "asc",
      },
      select: {
        src: true,
        alt: true,
        width: true,
        height: true,
        order: true,
      },
    });

    return images;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener imágenes de la galería");
  }
};
