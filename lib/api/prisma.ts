import { PrismaClient, User } from "@prisma/client";
import { NextApiRequest } from "next";
import { UserData } from "types/api";

export const database = new PrismaClient();

export async function getUser(request: NextApiRequest) {

    if(!request.headers.authorization) {
        return null;
    }

    //Get session
    const session = await database.session.findFirst({
        where: {
            sid: request.headers.authorization,
        },
    });

    //Check if session can't be found, or if it's expired
    if (session == null || session.expired) return null;

    //Get user
    const user = await database.user.findFirst({
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
    return await database.session.create({
        data: {
            userId: user.id,
        },
    });
}
