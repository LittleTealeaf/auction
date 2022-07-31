import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export type Methods = {
    [key: string]: NextApiHandler;
};

export default function apiHandler(methods: Methods) {
    return (request: NextApiRequest, response: NextApiResponse<any>) => {
        if (Object.hasOwn(methods, request.method || "")) {
            methods[request.method || ""](request, response);
        } else {
            response.status(405).json(`Invalud HTTP Method: ${request.method}`);
        }
    };
}
