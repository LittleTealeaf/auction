import { Method } from "types/api";
import { getSessionId } from "./session";

export type ApiParams = {
    [key: string]: any;
};

export async function fetchApi(url: string, method: Method, params: ApiParams = {}) {
    return fetch(
        `${url}?${Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&")}`,
        {
            method,
            headers: {
                authorization: getSessionId() || "",
            },
        }
    );
}

export function requireStatus(statusCode: number) {
    return async (response: Response): Promise<Response> => new Promise((resolve, reject) => {
        if(response.status != statusCode) {
            reject(`Expected Status ${statusCode}, found ${response.status}`);
        } else {
            resolve(response);
        }
    })
}

export async function jsonResponse(response: Response) {
    return response.json();
}

export function onCatch<T = any>(result: T) {
    return async (error: any) => result;
}
