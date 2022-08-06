import { PrismaClient, User } from "@prisma/client";
import { UserData } from "types/api";

export const prisma = new PrismaClient();


export function toUserData(user: User): UserData {
    const {password, ...userData} = user;
    return userData;
}
