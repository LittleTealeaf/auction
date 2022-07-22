import { AuthKey, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./prisma";

export async function createAuthKey(user: User): Promise<AuthKey> {
    const authKey = await db.authKey.create({
        data: {
            userId: user.id,
        },
    });

    return authKey;
}

function authError(response: NextApiResponse<any>, code: number, error: string) {
    response.status(code).json({error});
    return true;
}

export async function failedAuthorization(request: NextApiRequest, response: NextApiResponse<any>, permission: (user: User) => boolean) {
    const key = request.headers.authorization;

    if (key == null) return authError(response, 401, "Authorization Key not included in header");

    const auth = await db.authKey.findFirst({
        where: {
            key,
        },
    });

    if (auth == null) return authError(response, 401, "Invalid Authorization Key");

    const user = await db.user.findFirst({
        where: {
            id: auth.userId,
        },
    });

    if (user == null) return authError(response, 404, "Authorization Key's User not found");

    if (!permission(user)) return authError(response, 403, "Unauthorized Access");

    return false;
}
