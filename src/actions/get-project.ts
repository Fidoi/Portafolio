"use server";

import prisma from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export const getProductByTitle = async (title: string) => {
  try {
    const product = await prisma.project.findFirst({
      where: {
        title: {
          equals: title,
          mode: "insensitive",
        },
      },
      include: {
        mainInfo: true,
      },
    });

    return product;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener producto por título");
  }
};

/**
 * Resuelve un proyecto por su slug (derivado del título). Como el slug no se
 * guarda en la BD, comparamos por slug en memoria, pero sólo sobre id + title:
 * las relaciones se traen únicamente para el proyecto que coincide.
 * Esto permite URLs limpias (/projects/mi-proyecto) sin migrar el esquema.
 */
export const getProductBySlug = async (slug: string) => {
  try {
    const target = slugify(slug); // tolera mayúsculas / URLs antiguas
    const candidates = await prisma.project.findMany({
      select: { id: true, title: true },
    });
    const match = candidates.find((p) => slugify(p.title) === target);

    if (!match) return null;

    return await prisma.project.findUnique({
      where: { id: match.id },
      include: { mainInfo: true },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};
