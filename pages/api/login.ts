import { database } from "lib/api";
import { NextApiHandler } from "next";

export type AuthResponse = {
    auth: string | undefined;
    message: string | undefined;
};

const handler: NextApiHandler = async (request, response) => {
    const { username, password, auth } = request.query;

    if (auth != null) {
        const token = await database.token.findFirst({
            where: {
                token: String(auth),
            },
        });

        if (token != null && !token.expired) {
            return response.status(200).json({
                auth,
            });
        }
    }

    if (username == null) {
        return response.status(400).json({
            error: "Missing Parameter: username",
        });
    }

    if (password == null) {
        return response.status(200).json({
            error: "Missing Parameter: password",
        });
    }

    const user = await database.user.findFirst({
        where: {
            username: String(username),
        },
    });

    if (user == null || (user.password != null && user.password != String(password))) {
        return response.status(200).json({
            message: "Username and/or Password Incorrect",
        });
    }

    if (user.password == null) {
        await database.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: String(password),
            },
        });
    }

    const token = await database.token.create({
        data: {
            userId: user.id,
            permissionsId: user.permissionsId
        },
    });

    response.status(200).json({
        auth: token.token,
    });
};

export default handler;
