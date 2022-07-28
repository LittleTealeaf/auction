import { useEffect, useState } from "react";

export async function fetchAuth(endpoint: string, params: { [key: string]: string } = {}) {
    return fetch(
        `api/${endpoint}?${Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&")}`,
        {
            headers: {
                authorization: sessionStorage.getItem("auth") || "",
            },
        }
    );
}


export function fetchEffect<T = any>(consume: (key: T) => any, endpoint: string, params: {[key: string]: string}) {
    fetchAuth(endpoint,params).then(response => response.json()).then(consume);
}
