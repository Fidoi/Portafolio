// get-project.ts
'use server';

import prisma from '@/lib/prisma';

export const getProductByTitle = async (title: string) => {
  try {
    const product = await prisma.project.findFirst({
      where: {
        title: {
          equals: title,
          mode: 'insensitive',
        },
      },
      include: {
        mainInfo: true,
      },
    });

    return product;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener producto por título');
  }
};
