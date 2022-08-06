import { database, toUserData } from "lib/api/database";
import { apiHandler } from "lib/api/handler";
import { hashPassword } from "lib/api/security";

export default apiHandler({
    GET: async (request, response) => {
        const sid = String(request.headers.authorization);
        const session = await database.session.findFirst({ where: { sid } });

        if (!session || session.expired) {
            response.status(401).json({ message: "Authorization key not valid" });
            return;
        }

        const user = await database.user.findFirst({ where: { id: session.userId } });

        if (!user) {
            response.status(500).json({ message: `User ID ${session.userId} not found` });
            return;
        }

        response.status(200).json({
            user: toUserData(user)
        });
    },
    POST: async (request, response) => {
        const { username, password } = request.query as { username?: string; password?: string };
        const hashed = hashPassword(password || "");

        const user = await database.user.findFirst({
            where: {
                username,
                password: hashed,
            },
        });

        if (!user) {
            response.status(403).json({ message: "Username or Password incorrect" });
            return;
        }

        const session = await database.session.create({
            data: {
                userId: user.id,
            },
        });

        response.status(200).json({
            sid: session.sid,
            user: toUserData(user),
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
                    terminatedSid: session.sid,
                });
            })
            .catch((error) => {
                response.status(500).json({
                    message: "Interal Server Error",
                    error,
                });
            });
    },
});
