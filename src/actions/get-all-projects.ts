'use server';

import prisma from '@/lib/prisma';

export const getProjects = async () => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return projects;
  } catch (error) {
    console.log(error);
    return [];
  }
};
