import { hash } from "argon2";
import apiHandler from "lib/api/handler";
import { createSession, database, getUser, toUserData, setUserPassword } from "lib/api/prisma";

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
            await setUserPassword(user, request.cookies.auth, String(username));
        } else {
            if (user.password != password) return response.status(200).json({ message: "Password does not match" });
        }

        //Create a session key

        const session = await createSession(user);

        response.status(200).json({
            result: {
                sid: session.sid,
            user: toUserData(user)
            }
        });
    },
});
