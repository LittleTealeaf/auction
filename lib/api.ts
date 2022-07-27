import { NextApiRequest } from "next";
import { useAuthContext } from "pages/_app";
import { useState } from "react";
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

    db.apiKey.update({
        where: {
            id: key.id,
        },
        data: {
            lastUse: new Date(),
        },
    });

    return await db.user.findFirst({
        where: {
            id: key.userId,
        },
    });
}

export async function Fetch(
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

export function useFetch<T>(
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
    const [result, setResult] = useState<T | undefined>(undefined);
    Fetch(endpoint, { method, cache, headers, body })
        .then((result) => result.json())
        .then(setResult);
    return result;
}
