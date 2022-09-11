import { NextApiHandler, NextApiResponse } from "next";

export type Method = "OPTIONS" | "GET" | "HEAD" | "PUT" | "POST" | "DELETE" | "PATCH";

export type MethodList = {
  [method in Method]?: NextApiHandler;
};

export const respondError = (response: NextApiResponse<any>, code: number, message: string, error?: any) =>
  response.status(code).json({
    message,
    error,
  });

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


export function returnResponse(response: NextApiResponse<any>, code: number, data: any) {
  response.status(code).json(data);
}
