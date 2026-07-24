'use server';

import prisma from '@/lib/prisma';

export const getProjects = async () => {
  try {
    // `mainInfo` viene incluido porque la grilla de /projects necesita la
    // descripción y el enlace en vivo para que cada tarjeta diga de qué trata
    // el proyecto sin tener que entrar. Son 7 filas: el coste es irrelevante.
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: { mainInfo: true },
    });
    return projects;
  } catch (error) {
    console.log(error);
    return [];
  }
};
