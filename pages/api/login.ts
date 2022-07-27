import { db } from "lib/prisma";
import { NextApiHandler } from "next";
import { stringify } from "querystring";

export type AuthResponse = {
    auth: string | undefined;
    message: string | undefined;
}

const handler: NextApiHandler = async (request, response) => {
    const { username, password, auth } = request.query;

    if (auth != null) {
        const apiKey = await db.apiKey.findFirst({
            where: {
                key: String(auth),
            },
        });

        if (apiKey != null && !apiKey.expired) {
            return response.status(200).json({
                auth,
            });
        }
    }

    if (username == null) {
        return response.status(400).json("Missing Parameter: username");
    }

    if (password == null) {
        return response.status(200).json("Missing Parameter: password");
    }

    const user = await db.user.findFirst({
        where: {
            username: String(username)
        }
    });

    if(user == null || user.password != String(password)) {
        return response.status(200).json({
            message: "Username and/or Password Incorrect"
        });
    }

    const apiKey = await db.apiKey.create({
        data: {
            userId: user.id
        }
    });

    response.status(200).json({
        auth: apiKey.key
    })
};

export default handler;
