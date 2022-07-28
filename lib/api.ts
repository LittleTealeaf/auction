import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";


export const database = new PrismaClient();

export async function getToken(request: NextApiRequest) {
    return database.token.findFirst({
        where: {
            token: String(request.headers.authorization)
        }
    })
}

export async function getUser(request: NextApiRequest) {
    const auth = request.headers.authorization;

    if (auth === undefined) {
        return null;
    }

    const key = await database.token.findFirst({
        where: {
            token: auth,
        },
    });

    if (key == null || key.expired) {
        return null;
    }

    database.token.update({
        where: {
            id: key.id,
        },
        data: {
            lastUse: new Date(),
        },
    });

    return await database.user.findFirst({
        where: {
            id: key.userId,
        },
    });
}
