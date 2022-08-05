import { User } from "@prisma/client";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getUser } from "./database";

export type Methods = {
    [key: string]: NextApiHandler;
};

export default function apiHandler(methods: Methods) {
    return async (request: NextApiRequest, response: NextApiResponse<any>) =>
        new Promise(async (resolve) => {
            if (Object.hasOwn(methods, request.method || "")) {
                await methods[request.method || ""](request, response);
            } else {
                response.status(405).json(`Invalud HTTP Method: ${request.method}`);
            }
            resolve(0);
        });
}

export async function requireLogin(request: NextApiRequest, response: NextApiResponse<any>): Promise<User | null> {
    const user = await getUser(request);

    if (user == null) {
        response.status(401).json({ message: "No valid authorization provided in header" });
        return null;
    }

    return user;
}

