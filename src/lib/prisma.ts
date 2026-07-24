import { PrismaClient } from "@prisma/client";

/**
 * En desarrollo Next recarga los módulos en cada cambio (HMR). Sin este
 * singleton se instancia un PrismaClient nuevo por recarga, cada uno con su
 * propio query engine y pool de conexiones, y ninguno se libera: el proceso
 * termina reventando por falta de memoria.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
