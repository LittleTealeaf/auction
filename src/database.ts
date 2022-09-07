import { PrismaClient } from "@prisma/client";

declare global {
    var prisma_database: PrismaClient;
}

export const database = global.prisma_database || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma_database = database;
