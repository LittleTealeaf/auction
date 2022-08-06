import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { Method } from "types/api";
import { database } from "./database";

export type MethodList = {
    [method in Method]?: NextApiHandler;
};


export function apiHandler(methods: MethodList): NextApiHandler {
    return async (request, response) => {
        return new Promise(async (resolve) => {
            const method = request.method as Method;
            const handler = methods[method];
            if (handler) {
                await handler(request,response);
            } else {
                response.status(405).json({
                    message: `Invalid HTTP Method: ${request.method}`,
                });
            }
            resolve(true);
        });
    };
}

export async function getRequestUser(request: NextApiRequest) {
    const authentication = String(request.headers.authorization);
    const session = await database.session.findFirst({
        where: {
            sid: authentication
        }
    });

    if(!session || session.expired) return null;

    const user = await database.user.findFirst({
        where: {
            id: session.userId
        }
    });
    return user;
}
