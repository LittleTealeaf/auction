import { Customer } from "@prisma/client";
import { containsQuery, db } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

type Response = NextApiResponse<Customer[] | Customer | null>;

export default async function handler(req: NextApiRequest, res: Response) {
    if (req.method == "GET") {
        GET(req, res);
    }
}

type GetQueryParameters = {
    id?: number;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: string;
};

async function GET(req: NextApiRequest, res: Response) {
    const query: GetQueryParameters = req.query;

    //If the user specifies and ID, perform a singular id lookup
    if(query.id != null) {
        const result = await db.customer.findFirst({
            where: {
                id: query.id
            }
        });

        if(result == null) return res.status(204).end();

        return res.status(200).json(result);
    }

    //Perform a full query
    const result = await db.customer.findMany({
        where: {
            firstName: containsQuery(query.firstName),
            lastName: containsQuery(query.lastName),
            phone: containsQuery(query.phone),
            address: containsQuery(query.address),
            email: containsQuery(query.email)
        }
    })

    if(result.length == 0) return res.status(204).end();

    return res.status(200).json(result);
}
