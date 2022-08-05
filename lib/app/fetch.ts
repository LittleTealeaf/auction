import { ApiMethod } from "types/api";

export function fetchAPI(method: ApiMethod, url: string, params: { [key: string]: any } = {}) {
    return fetch(
        `${url}?${Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&")}`,
        {
            method,
            headers: {
                authorization: String(sessionStorage.getItem("auth") || ""),
            },
        }
    );
}

export async function fetchJson<T = any>(method: ApiMethod, url: string, params: {[key: string]: any} = {}) {
    const response = await fetchAPI(method, url, params);
    const json = await response.json();
    return json as T;
}

export function getStatusJson(code: number) {
    return async (result: Response) => {
        if (result.status == code) return await result.json();
        return null;
    };
}
