import { User } from "@prisma/client";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { Method } from "types/api";
import { database } from "./database";

export type AuthApiHandler = (request: NextApiRequest, response: NextApiResponse, user: User) => any;

export type MethodList = {
    [method in Method]?: NextApiHandler;
};

export type AuthMethodList = {
    [method in Method]?: AuthApiHandler;
};

export function apiHandler(methods: MethodList): NextApiHandler {
    return async (request, response) => {
        return new Promise(async (resolve) => {
            const method = request.method as Method;
            const handler = methods[method];
            if (handler) {
                await handler(request, response);
            } else {
                respondError(response, 405, `Invalid HTTP Method: ${request.method}`);
            }
            resolve(true);
        });
    };
}

export function authApiHandler(methods: AuthMethodList): NextApiHandler {
    return async (request, response) => {
        return new Promise(async (resolve) => {
            const method = request.method as Method;
            const handler = methods[method];
            const user = await getRequestUser(request);

            if (!user) return respondError(response, 401, "Not Authenticated");

            if (handler) {
                await handler(request, response, user);
            } else {
                respondError(response, 405, `Invalid HTTP Method: ${request.method}`);
            }
            resolve(true);
        });
    };
}

export async function getRequestUser(request: NextApiRequest) {
    const authentication = String(request.headers.authorization);
    const session = await database.session.findFirst({
        where: {
            sid: authentication,
        },
    });

    if (!session || (session.expires && session.expires.getTime() < Date.now())) return null;

    const user = await database.user.findFirst({
        where: {
            id: session.userId,
        },
    });
    return user;
}

export function respond(response: NextApiResponse<any>, code: number, json: any) {
    response.status(code).json(json);
}

export function respondError(response: NextApiResponse<any>, code: number, message: string, error?: any) {
    respond(response, code, { message, error });
}

export function asBoolean(value?: string) {
    return value ? value == 'true' : undefined;
}
