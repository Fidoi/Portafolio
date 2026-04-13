"use server";

import prisma from "@/lib/prisma";

export const getPlayList = async () => {
  try {
    const tracks = await prisma.playList.findMany({
      orderBy: {
        position: "asc",
      },
      select: {
        id: true,
        name: true,
        videoId: true,
        position: true,
      },
    });

    return tracks;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener la playlist");
  }
};
