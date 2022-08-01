import { hash } from "argon2";
import apiHandler from "lib/api/handler";
import { createSession, database, getUser, toUserData } from "lib/api/prisma";

export default apiHandler({
    GET: async (request, response) =>
        getUser(request).then((user) => {
            if (user) {
                const { id, password, ...userData } = user;
                response.status(200).json({ user: userData });
            } else {
                response.status(200).json({ message: "Invalid or expired session" });
            }
        }),
    POST: async (request, response) => {
        const { username, password } = request.query;

        const user = await database.user.findFirst({
            where: {
                username: String(username),
            },
        });

        if (user == null) return response.status(200).json({ message: "User not found" });

        if (user.password == null) {
            user.password = await database.user
                .update({
                    where: { id: user.id },
                    data: { password: String(password) },
                })
                .then((user) => user.password);
        } else {
            if (user.password != password) return response.status(200).json({ message: "Password does not match" });
        }

        //Create a session key

        const session = await createSession(user);

        response.status(200).json({
            result: {
                sid: session.sid,
                user: toUserData(user),
            },
        });
    },
    DELETE: async (request, response) => {
        await database.session
            .update({
                where: {
                    sid: request.headers.authorization,
                },
                data: {
                    expired: true,
                },
            })
            .then((session) => {
                response.status(202).json({
                    oldSid: session.sid,
                });
            })
            .catch((error) => {
                response.status(500).json({ message: "Internal Database Error", error });
            });
    },
});
