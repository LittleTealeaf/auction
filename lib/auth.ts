import { NextApiRequest } from "next";
import { useAuthContext } from "pages/_app";
import { db } from "./prisma";

export async function verifyAuth(request: NextApiRequest) {
    const auth = request.headers.authorization;

    if (auth === undefined) {
        return null;
    }

    const key = await db.apiKey.findFirst({
        where: {
            key: auth,
        },
    });

    if (key == null || key.expired) {
        return null;
    }

    return await db.user.findFirst({
        where: {
            id: key.userId,
        },
    });
}

export async function useFetch(
    endpoint: string,
    {
        method = "GET",
        cache = "default",
        headers = {},
        body = {},
    }: {
        method: "GET" | "POST" | "DELETE" | "PUT";
        cache: "no-cache" | "reload" | "default" | "only-if-cached";
        headers: {
            [key: string]: string;
        };
        body: {
            [key: string]: string;
        };
    }
) {
    return fetch(`api/${endpoint}`, {
        method,
        body: JSON.stringify(body),
        cache,
        headers: {
            ...headers,
            authentication: useAuthContext(),
        },
    });
}
