import { PrismaClient, User } from "@prisma/client";
import { UserData } from "types/api";

declare global {
    var prisma_database: PrismaClient;
}

export const database = global.prisma_database || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma_database = database;

export function toUserData(user: User): UserData {
    const { password, ...userData } = user;
    return userData;
}

export function asUserData(user: User | null | undefined): UserData | null {
    if (!user) return null;

    return toUserData(user);
}

export function mapToUserData(user: User[]) {
    return user.map(toUserData);
}
