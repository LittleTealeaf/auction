import { asUserData, database, toUserData } from "src/database";
import { authApiHandler, respond, respondError } from "src/api/handler";
import { hashPassword } from "src/api/security";

export default authApiHandler({
    GET: async (request, response, rUser) => {
        const { id } = request.query;
        if (rUser.id != Number(id) && !rUser.manageUsers) {
            return respondError(response, 401, "Unauthorized");
        }

        const user = await database.user
            .findFirst({
                where: {
                    id: Number(id),
                },
            })
            .then(asUserData);

        if (!user) return respondError(response, 404, "User not found");

        respond(response, 200, { user });
    },
    PUT: async (request, response, rUser) => {
        const { id, username, password, manageUsers } = request.query as {
            id: string;
            username?: string;
            password?: string;
            manageUsers?: string;
        };

        if (!rUser.manageUsers && Number(id) != rUser.id) {
            return respondError(response, 403, "Not Permitted");
        }

        if (!rUser.manageUsers && manageUsers) {
            return respondError(response, 403, "Invalid Permissions to change parameters");
        }

        const user = await database.user.findFirst({
            where: {
                id: Number(id),
            },
        });

        if (!user) return respondError(response, 404, "User not found");

        // if the user is setting their password, expire all sessions except for the current one that is attached to that user

        if (password) {
            await database.session.updateMany({
                where: {
                    userId: user.id,
                    sid: {
                        not: request.headers.authorization,
                    },
                },
                data: {
                    expires: new Date(new Date().getTime() - 1),
                },
            });
        }

        if (user.protected && user.manageUsers && manageUsers === "false") return respondError(response, 403, "Protected User");

        const result = await database.user
            .update({
                where: {
                    id: user.id,
                },
                data: {
                    username,
                    password: password ? hashPassword(password) : undefined,
                    manageUsers: manageUsers ? manageUsers === "true" : undefined,
                },
            })
            .then(toUserData)
            .catch((error) => {
                respondError(response, 500, "Internal Server Error", error);
            });

        if (result) respond(response, 200, { result });
    },
    DELETE: async (request, response, rUser) => {
        const { id } = request.query;
        if (rUser.id != Number(id) && !rUser.manageUsers) {
            return respondError(response, 401, "Unauthorized");
        }

        const user = await database.user.findFirst({
            where: {
                id: Number(id),
            },
        });

        if (!user) return respondError(response, 404, "User not found");

        if (user.protected) return respondError(response, 403, "Protected User");

        await database.user.delete({
            where: {
                id: Number(id),
            },
        });

        await database.session.updateMany({
            where: {
                userId: Number(id),
            },
            data: {
                expires: new Date(new Date().getTime() - 1),
            },
        });

        respond(response, 200, { user: toUserData(user) });
    },
});
