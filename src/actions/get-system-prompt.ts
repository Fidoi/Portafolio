"use server";
import prisma from "@/lib/prisma";

export const getSystemPrompt = async () => {
  try {
    const promptRecord = await prisma.systemPrompt.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!promptRecord) {
      throw new Error("No se encontró systemPrompt en la base de datos");
    }

    return promptRecord.content;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener systemPrompt");
  }
};
