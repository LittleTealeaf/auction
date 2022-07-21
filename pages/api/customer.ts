import { Customer } from "@prisma/client";
import { containsQuery, db } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

type Response = NextApiResponse<Customer[] | Customer | null>;

export default async function handler(req: NextApiRequest, res: Response) {
    if (req.method == "GET") return GET(req, res);
    if (req.method == "POST") return POST(req, res);
}

async function GET(req: NextApiRequest, res: Response) {
    //TODO: Change this so theres a "query" term that just searches for matches in all categories

    const query: {
        id?: number;
        query?: string;
    } = req.query;

    if (query.id != null) {
        const result = await db.customer.findUnique({
            where: {
                id: query.id,
            },
        });

        if (result == null) {
            res.status(204).end();
            return;
        }

        return res.status(200).json(result);
    }

    if (query.query == null) {
        const result = await db.customer.findMany();

        return res.status(200).json(result);
    }

    const result = await db.customer.findMany({
        where: {
            AND: query.query.split(" ").map((text) => ({
                OR: [
                    {
                        firstName: containsQuery(text),
                    },
                    {
                        lastName: containsQuery(text),
                    },
                    {
                        address: containsQuery(text),
                    },
                    {
                        notes: containsQuery(text),
                    },
                    {
                        email: containsQuery(text),
                    },
                    {
                        phone: containsQuery(text),
                    },
                ],
            })),
        },
    });

    res.status(200).json(result);
}

async function POST(req: NextApiRequest, res: Response) {
    const data = req.query;

    if (req.query.id == null) {
        // Create and update req query id
        const new_customer = await db.customer.create({
            data: {},
        });

        data.id = String(new_customer.id);
    }

    const id = Number(data.id);
    delete data.id;

    const result = await db.customer.update({
        where: {
            id: id,
        },
        data,
    });

    return res.status(200).json(result);
}
