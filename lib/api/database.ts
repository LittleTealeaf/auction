import { PrismaClient, User } from "@prisma/client";
import { NextApiRequest } from "next";
import { UserData } from "types/api";

export const prisma = new PrismaClient();

export async function getUser(request: NextApiRequest) {

    if(!request.headers.authorization) {
        return null;
    }

    //Get session
    const session = await prisma.session.findFirst({
        where: {
            sid: request.headers.authorization,
        },
    });

    //Check if session can't be found, or if it's expired
    if (session == null || session.expired) return null;

    //Get user
    const user = await prisma.user.findFirst({
        where: {
            id: session.userId,
        },
    });

    return user;
}


export function toUserData(user: User): UserData {
    const {password, ...userData} = user;
    return userData;
}

export async function createSession(user: User) {
    return await prisma.session.create({
        data: {
            userId: user.id,
        },
    });
}
