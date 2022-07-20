import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

export function runPrisma(fun: (client: PrismaClient) => Promise<void> | void) {
    return fun(db);
}

export function containsQuery<T>(query: T) {
    return {
        contains: query,
    };
}
