import { Customer, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

type Response = NextApiResponse<Customer[] | Customer | null>;

interface LooseObject {
    [key: string]: any;
}

export default async function handler(req: NextApiRequest, res: Response) {
    if (req.method == "GET") {
        GET(req, res);
    }
}

async function GET(req: NextApiRequest, res: Response) {
    const where: LooseObject = {};

    if(Object.hasOwn(req.query,"id")) {
        where.id = Number(req.query.id);
    } else {
        Object.entries(req.query).forEach(([key, contains]) => {
            if(key != "id") {
                where[key] = {
                    contains,
                };
            }
        });
    }

    const client = new PrismaClient();

    const queryResult: Customer[] | null = await client.customer.findMany({
        where
    });

    await client.$disconnect();

    res.status(200).send(queryResult);
}
