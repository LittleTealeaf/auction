import { PrismaClient, User } from "@prisma/client";
import { UserData } from "types/api";

console.log("Creating new database connection");
export const database = new PrismaClient();

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

export async function logEvent(userId: number, action: string, description?: string) {
    await database.log.create({
        data: {
            userId,
            action,
            description,
        },
    });
}
