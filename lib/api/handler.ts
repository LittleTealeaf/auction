import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./database";

export type Method = "OPTIONS" | "GET" | "HEAD" | "PUT" | "POST" | "DELETE" | "PATCH";

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

export async function requireLogin(method: NextApiHandler) {
    const handler: NextApiHandler = async (request, response) => {
        const authentication = String(request.headers.authentication);
        const session = await prisma.session.findFirst({
            where: {
                sid: authentication,
            },
        });
        if (session && !session.expired) {
            await method(request, response);
        } else {
            response.status(401).json({ message: "No valid authentication provided" });
        }
    };
    return handler;
}
