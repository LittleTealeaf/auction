export function fetchAPI(method: string, url: string, params: { [key: string]: any } = {}) {
    return fetch(
        `${url}?${Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&")}`,
        {
            method,
            headers: {
                authorization: String(localStorage.getItem("auth")),
            },
        }
    );
}

export function getStatusJson(code: number) {
    return async (result: Response) => {
        if (result.status == code) return await result.json();
        return null;
    };
}
