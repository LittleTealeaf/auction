import { database, mapToUserData, toUserData } from "src/api/database";
import { asBoolean, authApiHandler } from "src/api/handler";
import { hashPassword } from "src/api/security";

export default authApiHandler({
    GET: async (request, response, user) => {
        if (!user?.manageUsers) return response.status(403).json({ message: "No sufficient permissions" });

        const { username } = request.query as { username?: string; manageUsers?: boolean; isProtected?: boolean };

        const users = await database.user
            .findMany({
                where: {
                    username: username
                        ? {
                              contains: username,
                          }
                        : undefined,
                },
            })
            .then(mapToUserData);
        response.status(200).json({ users });
    },
    POST: async (request, response, user) => {
        if (!user?.manageUsers) return response.status(403).json({ message: "No suffciient permissions" });

        const { username, password, manageUsers, requirePasswordReset } = request.query as {
            username?: string;
            password?: string;
            manageUsers?: string;
            requirePasswordReset?: string;
        };

        const badRequest = (message: string) => response.status(400).json({ message });

        if (!username) return badRequest("Username not specified");
        if (!password) return badRequest("Password not specified");

        const created = await database.user
            .create({
                data: {
                    username,
                    password: hashPassword(password),
                    manageUsers: asBoolean(manageUsers),
                    requirePasswordReset: asBoolean(requirePasswordReset),
                },
            })
            .then(toUserData)
            .catch((error) => response.status(500).json({ message: "Internal Server Error", error }));

        if (!created) return;

        response.status(201).json({ user });
    },
});
