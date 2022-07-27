export async function fetchAPI({
    url,
    method,
    headers,
    body,
}: {
    url: string;
    method: "POST" | "GET" | "PATCH" | "DELETE";
    headers?: {
        [key: string]: string;
    };
    body?: {
        [key: string]: string;
    };
}) {
    return fetch(url,{
        method,
        headers: {
            ...headers,
            'Content-Type': 'applicaiton/json'
        },
        body: JSON.stringify(body)
    });
}
