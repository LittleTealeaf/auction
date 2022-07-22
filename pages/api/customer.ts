import { Customer } from "@prisma/client";
import { failedAuthorization } from "lib/auth";
import { containsQuery, db } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

type Response = NextApiResponse<
    | Customer[]
    | Customer
    | null
>;

export default async function handler(req: NextApiRequest, res: Response) {
    if (req.method == "GET") return GET(req, res);
    if (req.method == "PUT") return PUT(req, res);
    if (req.method == "POST") return POST(req, res);
    if (req.method == "DELETE") return DELETE(req, res);

    res.status(405).end();
}

//Get
async function GET(req: NextApiRequest, res: Response) {
    if (await failedAuthorization(req, res, (user) => user.customerRead)) return;

    //TODO: Change this so theres a "query" term that just searches for matches in all categories

    const query: {
        id?: number;
        query?: string[];
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

    //TODO add missing
}

//Update
async function PUT(req: NextApiRequest, res: Response) {
    if (await failedAuthorization(req, res, (user) => user.customerWrite)) return;

    if (req.query.id == null) {
        res.status(400).end();
        return;
    }

    const id = Number(req.query.id);
    const data = req.query;
    delete data.id;

    const result = await db.customer.update({
        where: {
            id,
        },
        data,
    });

    res.status(200).json(result);
}

//Create
async function POST(req: NextApiRequest, res: Response) {
    if (await failedAuthorization(req, res, (user) => user.customerCreate)) return;

    const data = req.query;

    const result = await db.customer.create({
        data,
    });

    res.status(200).json(result);
}

//Delete
async function DELETE(req: NextApiRequest, res: Response) {
    if (await failedAuthorization(req, res, (user) => user.customerDelete)) return;
}

// async function POST_old(req: NextApiRequest, res: Response) {

//     const data = req.query;

//     if (req.query.id == null) {
//         // Create and update req query id
//         const new_customer = await db.customer.create({
//             data: {},
//         });

//         data.id = String(new_customer.id);
//     }

//     const result = await db.customer.update({
//         where: {
//             id: Number(req.query.id),
//         },
//         data
//     });

//     return res.status(200).json(result);
// }

//
