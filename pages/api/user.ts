import apiHandler, { requireLogin } from "lib/api/handler";
import { database, toUserData } from "lib/api/prisma";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

function withPermissions(handler: NextApiHandler) {
    return async (request: NextApiRequest, response: NextApiResponse) => {
        const user = await requireLogin(request, response);
        if (!user) return;
        if (!user.manageUsers) {
            response.status(403).json({ message: "User is not authorized" });
            return;
        }
        await handler(request, response);
    };
}

export default apiHandler({
    GET: withPermissions(async (request, response) => {
        const { id, username } = request.query;

        if (id) {
            const user = await database.user.findFirst({ where: { id: Number(id) } });
            response.status(200).json(user);
            return;
        }

        if (username) {
            const users = await database.user.findMany({
                where: {
                    username: {
                        contains: String(username),
                    },
                },
            });
            response.status(200).json(users.map(toUserData));
            return;
        }

        const users = await database.user.findMany();
        response.status(200).json(users.map(toUserData));
    }),
    POST: withPermissions(async (request, response) => {
        const { username, password, manageUsers } = request.query;

        const data = {
            username: String(username),
            password: String(password) || null,
            manageUsers: Boolean(manageUsers) || false,
        };

        const user = await database.user
            .create({
                data,
            })
            .catch((error) => {
                response.status(409).json({ message: "Prisma Error", error });
                return null;
            });

        if (user) response.status(201).json(toUserData(user));
    }),
    PUT: withPermissions(async (request, response) => {
        const { id, username, password, manageUsers } = request.query;

        var user = await database.user.findFirst({
            where: {
                id: Number(id),
            },
        });
        if (!user) return response.status(404).json({ message: "User ID not found" });

        if (username) user.username = String(username);
        if (password !== undefined) user.password = password == null ? null : String(password);
        if (manageUsers !== undefined) user.manageUsers = manageUsers === 'true';

        const result = await database.user.update({
            where: {
                id: Number(id),
            },
            data: user,
        });

        //Remove all sessions except for current session
        await database.session.updateMany({
            where: {
                NOT: {
                    sid: String(request.headers.authorization)
                }
            },
            data: {
                expired: true
            }
        });

        response.status(200).json(toUserData(result));
    }),
    DELETE: withPermissions(async (request, response) => {
        const { id } = request.query;

        const result = await database.user
            .delete({
                where: {
                    id: Number(id),
                },
            })
            .catch((error) => {
                response.status(404).json({ message: "Error deleting user", error });
                return null;
            });

        if (result) response.status(200).json(toUserData(result));
    }),
});
